/***********************************************
 * 1) Make sure to import & register Draggable *
 ***********************************************/
// import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";
// gsap.registerPlugin(Draggable);

/***********************************************
 * 2) Original Setup
 ***********************************************/
const wrapper = document.querySelector(".gallery-container");
const colors = ["#0ae448","#9d95ff", "#abff84", "#00bae2"];
const boxes = gsap.utils.toArray(".gallery-item");
console.clear();

// Smooth scroll configuration
const scroller = {
  target: wrapper,
  ease: 0.05,
  endX: 0,
  x: 0,
  scrollRequest: 0,
  touchStart: 0,
  isDragging: false
};

let activeElement;
let requestId = null;
let isScrolling = false;
let currentVelocity = 0;

/***********************************************
 * 3) Build the horizontalLoop() timeline
 ***********************************************/
const loop = horizontalLoop(boxes, {
  paused: true, 
  draggable: true, 
  center: true,
  onChange: (element, index) => {
    activeElement && activeElement.classList.remove("active");
    element.classList.add("active");
    activeElement = element;
  },
  speed: 1.2
});

/***********************************************
 * 4) Smooth Scroll Wheel Logic
 ***********************************************/
function updateScroller() {
  if (!isScrolling) return;
  
  scroller.x += (scroller.endX - scroller.x) * scroller.ease;
  
  if (Math.abs(scroller.endX - scroller.x) < 0.1) {
    scroller.x = scroller.endX;
    isScrolling = false;
  }
  
  requestId = requestAnimationFrame(updateScroller);
}

wrapper.addEventListener('wheel', (e) => {
  e.preventDefault();
  
  if (!isScrolling) {
    isScrolling = true;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const velocity = Math.abs(e.deltaY);
    const duration = Math.max(0.8, Math.min(1.5, 1 + (velocity * 0.001)));
    
    scroller.endX += direction * velocity;
    
    if (direction > 0) {
      loop.next({ 
        duration: duration, 
        ease: "power2.out",
        onUpdate: () => {
          if (!requestId) {
            requestId = requestAnimationFrame(updateScroller);
          }
        },
        onComplete: () => {
          isScrolling = false;
          cancelAnimationFrame(requestId);
          requestId = null;
        }
      });
    } else {
      loop.previous({ 
        duration: duration, 
        ease: "power2.out",
        onUpdate: () => {
          if (!requestId) {
            requestId = requestAnimationFrame(updateScroller);
          }
        },
        onComplete: () => {
          isScrolling = false;
          cancelAnimationFrame(requestId);
          requestId = null;
        }
      });
    }
  }
});

/***********************************************
 * 5) (If you had external drag overrides, 
 *    leave them commented out)
 ***********************************************/

// boxes.forEach(... click handler ... ) remains below

/***********************************************
 * 6) Click Handling (Works as-is)
 ***********************************************/
boxes.forEach((box, i) => box.addEventListener("click", () => {
  isScrolling = true;
  
  loop.toIndex(i, {
    duration: 0.8, 
    ease: "power2.out",
    onUpdate: () => {
      if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
      }
    },
    onComplete: () => {
      isScrolling = false;
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  });
}));

/***********************************************
 * 7) Updated horizontalLoop() with "smooth drag"
 ***********************************************/
function horizontalLoop(items, config) {
  let timeline;
  items = gsap.utils.toArray(items);
  config = config || {};
  gsap.context(() => {
    let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
          repeat: config.repeat,
          onUpdate: onChange && function() {
            let i = tl.closestIndex();
            if (lastIndex !== i) {
              lastIndex = i;
              onChange(items[i], i);
            }
          },
          paused: config.paused,
          defaults: {ease: "none"},
          onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        spaceBefore = [],
        xPercents = [],
        curIndex = 0,
        indexIsDirty = false,
        center = config.center,
        pixelsPerSecond = (config.speed || 1) * 50,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
        timeOffset = 0,
        container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
        totalWidth,
        getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1]
          - startX + spaceBefore[0] + items[length-1].offsetWidth 
          * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
        populateWidths = () => {
          let b1 = container.getBoundingClientRect(), b2;
          items.forEach((el, i) => {
            widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
            b2 = el.getBoundingClientRect();
            spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
            b1 = b2;
          });
          gsap.set(items, {xPercent: i => xPercents[i]});
          totalWidth = getTotalWidth();
        },
        timeWrap,
        populateOffsets = () => {
          timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
          center && times.forEach((t, i) => {
            times[i] = timeWrap(tl.labels["label" + i] + tl.duration() 
              * widths[i] / 2 / totalWidth - timeOffset);
          });
        },
        getClosest = (values, value, wrap) => {
          let i = values.length, closest = 1e10, index = 0, d;
          while (i--) {
            d = Math.abs(values[i] - value);
            if (d > wrap / 2) d = wrap - d;
            if (d < closest) {
              closest = d;
              index = i;
            }
          }
          return index;
        },
        populateTimeline = () => {
          tl.clear();
          for (let i = 0; i < length; i++) {
            let item = items[i],
                curX = xPercents[i] / 100 * widths[i],
                distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0],
                distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(item, {
                xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
                duration: distanceToLoop / pixelsPerSecond
              }, 0)
              .fromTo(item, {
                xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)
              }, {
                xPercent: xPercents[i],
                duration: (totalWidth - distanceToLoop) / pixelsPerSecond,
                immediateRender: false
              }, distanceToLoop / pixelsPerSecond)
              .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
          }
          timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        refresh = (deep) => {
          let progress = tl.progress();
          tl.progress(0, true);
          populateWidths();
          deep && populateTimeline();
          populateOffsets();
          deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
        },
        onResize = () => refresh(true),
        proxy;
    
    gsap.set(items, {x: 0});
    populateWidths();
    populateTimeline();
    populateOffsets();
    window.addEventListener("resize", onResize);
    
    function toIndex(index, vars) {
      vars = vars || {};
      (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
      let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
      if (time > tl.time() !== index > curIndex && index !== curIndex) {
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      if (time < 0 || time > tl.duration()) {
        vars.modifiers = {time: timeWrap};
      }
      curIndex = newIndex;
      vars.overwrite = true;
      gsap.killTweensOf(proxy);    
      return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
    }
    
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = setCurrent => {
      let index = getClosest(times, tl.time(), tl.duration());
      if (setCurrent) curIndex = index;
      return index;
    };
    tl.current = () => curIndex;
    tl.next = vars => toIndex(tl.current()+1, vars);
    tl.previous = vars => toIndex(tl.current()-1, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true);
    if (config.reversed) tl.reverse();
    
    /***********************************************
     *  Draggable creation with "smooth" dragging
     ***********************************************/
    if (config.draggable && typeof(Draggable) === "function") {
      proxy = document.createElement("div");
      let wrapProg = gsap.utils.wrap(0, 1),
          startProgress, draggable, ratio;
      
      draggable = Draggable.create(proxy, {
        trigger: wrapper,
        type: "x",
        inertia: true,
        resistance: 200,
        
        // Called onPress, GSAP 3.12+ uses onPressInit for fresh pointer events
        onPressInit() {
          gsap.killTweensOf(tl);
          tl.pause();
          startProgress = tl.progress();
          refresh();
          ratio = 1 / totalWidth;
          gsap.set(proxy, {x: startProgress / -ratio});
        },
        
        // "Smooth" approach: tween the timeline’s progress 
        // instead of setting it directly:
        onDrag() {
          const newProgress = wrapProg(startProgress + (draggable.startX - draggable.x) * ratio);
          // Kill any old progress-tweens so they don’t stack
          gsap.killTweensOf(tl, "progress");
          // Tween the timeline's progress with some easing
          gsap.to(tl, {
            duration: 0.2,         // adjust for more/less smoothing
            ease: "power2.out",
            progress: newProgress
          });
        },
        
        // Same logic on throw-update, so inertia also looks smooth
        onThrowUpdate() {
          const newProgress = wrapProg(startProgress + (draggable.startX - draggable.x) * ratio);
          gsap.killTweensOf(tl, "progress");
          gsap.to(tl, {
            duration: 0.2,
            ease: "power2.out",
            progress: newProgress
          });
        },
        
        // The snap ensures we land on a nearest item in your infinite loop
        snap: value => {
          let time = -(value * ratio) * tl.duration(),
              wrappedTime = timeWrap(time),
              snapTime = times[getClosest(times, wrappedTime, tl.duration())],
              dif = snapTime - wrappedTime;
          Math.abs(dif) > tl.duration()/2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
          return (time + dif) / tl.duration() / -ratio;
        },
        
        // On release or throwComplete, we finalize to an item index
        onRelease() {
          tl.closestIndex(true);
          const velocity = Math.abs(draggable.getVelocity());
          const duration = Math.max(0.8, Math.min(1.8, 1 + (velocity * 0.001)));
          tl.toIndex(curIndex, {duration: duration, ease: "expo.out"});
        },
        onThrowComplete() {
          tl.closestIndex(true);
          const velocity = Math.abs(draggable.getVelocity());
          const duration = Math.max(0.8, Math.min(1.6, 1 + (velocity * 0.001)));
          tl.toIndex(curIndex, {duration: duration, ease: "expo.out"});
        }
      })[0];
      tl.draggable = draggable;
    }
    
    tl.closestIndex(true);
    onChange && onChange(items[curIndex], curIndex);
    timeline = tl;
    return () => window.removeEventListener("resize", onResize);
  });
  return timeline;
}
