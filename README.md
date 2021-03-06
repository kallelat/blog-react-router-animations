# How to add transition animations to React page changes

In this article I'm showing how to add a simple transition animation to React route page changes.

Technologies used:

- React with TypeScript
- React Router (note V6 is somewhat different from earlier versions)
- Plain CSS files imported to React

## Initial setup and configuration

1. Create a new React app with `npx create-react-app . --template typescript`
2. Install requires packages `npm install react-router-dom react-transition-group --save`
3. Install type definitions `npm install @types/react-transition-group --save-dev`
4. Start dev server using `npm start`
5. Use my [original code bundle](initial.zip) to start with or build your own

## The problem with page transitions

Normally, small animations can be done using plain CSS' `transition` property and by modifying css values to create a smooth animation. However, when the React app changes `route` the old page component is instantly replaced with the new component.

For cool animations you usually need both components - the old and the new.

## How react-transition-group helps

No worries, `react-transition-group` library can help animating route changes. It makes the old and the new component stay on DOM during the transition period.

It flags the old component `exiting` and the new component `entering`. In practise, it will introduce a few new classes for both of the components:

For it to work, the animation requires three parameters: `mode`, `prefix` and `timeout`.

**Mode** is either `"in-out"`, `"out-in"` or `undefined`. It defines the logic how the exiting and the entering component co-exist during the transition. The default is `undefined`.

If the mode is `in-out`, the `entering` animation will be completely executed before `exiting`. In `out-in` the flow is the opposite. If the mode is left `undefined`, both of the animations take place at the same time.

**Timeout** is how long the animation should take in milliseconds.

**Prefix** is a plain string, that is prepended to CSS class names generated by the library.

The animation flow goes like this:

1. when the animation starts, the leaving component will get `.<prefix>-exit` class and the entering will get `.<prefix>-enter` class. These classes can be used to define the initial state for the both components. Also, you should place `transition` property to these classes to actually enable the animation.

2. immediately after the initial state, the components will get another classes: `.<prefix>-exit-active` and `.<prefix>-enter-active`. These classes should have the "final state" of each component at the end of the animation.

3. after the animation is completed, the class names mentioned earlier are removed and the exiting component is removed from the DOM.

**NOTE** you can define a different animation for `exit` and `enter` but the `timeout` defined earlier is shared, so you need to make sure you `transition` takes no more than your `timeout`.

**NOTE** there are a few extra classes, but we will skip those in this tutorial.

## Adding animations

### Setup the animation CSS

Add the file `components/slide-animation.css` and add there the following content:

```css
/* this is the initial state for entering component, direction right */
.slide-enter.right {
  transform: translateX(100%);
}

/* this is the initial state for entering component, direction left */
.slide-enter.left {
  transform: translateX(-100%);
}

/* this is the initial state for exiting component */
.slide-exit.right,
.slide-exit.left {
  transform: translateX(0);
}

/* this is the state entering component will have at the end of the animation */
.slide-enter-active.right,
.slide-enter-active.left {
  opacity: 1;
  transform: translateX(0);
}

/* this is the state exiting component will have at the end of the animation, direction right */
.slide-exit-active.right {
  transform: translateX(-100%);
}

/* this is the state exiting component will have at the end of the animation, direction left */
.slide-exit-active.left {
  transform: translateX(100%);
}

/* common rule, usually used for defining css transition rules
    NOTE: if you want to make the animation smooth, the transition-delay should same as with <CSSTransition /> component
*/
.slide-enter,
.slide-exit {
  transition: transform 1000ms;
}
```

### Changes to Slide component

The slide component is a bit more trickier, we need to define `Direction` for our animation. When clicking either the `Previous` or `Next` buttons, we change the direction accordinly. The `exiting` component will use the the direction defined in `internalDirection` state and the new `entering` component will get the correct direction through `onChange(...)` callback.

First we need to add a few imports:

```typescript
import React, { FunctionComponent, useState } from "react";
import "./slide-animation.css";
```

Then we need to define `Direction` type for typescript and `props` for the Slide component.

```typescript
export type Direction = "left" | "right";

interface SlideProps {
  direction: Direction;
  onChange: (direction: Direction) => void;
}

const Slide: FunctionComponent<SlideProps> = ({ direction, onChange }) => {
```

When the user clicks the navigation buttons, we need to change the internal state and pass on the new direction to parent component.

Add this to the top of the component:

```typescript
const [internalDirection, toggleInternalDirection] = useState(direction);
```

And these these lines to `gotoSlide()` method.

```typescript
const newDirection = toSlide > currentSlide ? "right" : "left";
onChange(newDirection);
toggleInternalDirection(newDirection);
```

The last remaining change is to add the `direction` as a classname to the component:

```typescript
<div className={`slide ${internalDirection}`}>
```

### Changes to Slideshow component

This component has the most changes as the actual control of the animation is added here.

First, we add some new imports:

```typescript
import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Slide, { Direction } from "./slide";
import "./slideshow.css";
```

Then, we need two new hooks - one for fetching the location from the router and one for keeping track of current `direction`;

```typescript
const location = useLocation();
const [direction, toggleDirection] = useState<Direction>("right");
```

To actually add the animation support, wrap the existing `Routes` component like this: (notice adding `location` attribute for the `Routes`)

```typescript
<TransitionGroup className="slideshow">
  <CSSTransition key={location.pathname} classNames="slide" timeout={1000}>
    <Routes location={location}>...</Routes>
  </CSSTransition>
</TransitionGroup>
```

And finally we need to alter the last route definition a bit:

```typescript
<Route
  path="/slides/:number"
  element={<Slide onChange={toggleDirection} direction={direction} />}
/>
```

### Changes to layout

After the code changes, we now face a problem - there is two `Slides` rendered at the same time and the result looks a bit wonky. Hence, we need to add these CSS rules to `slide.css` as a fix.

```css
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

Also, as the transition-group adds a another DOM layer, add this to `slideshow.css`:

```css
.slideshow {
  flex: 1;
  display: flex;
}
```

## Summary

Transitions between route changes are a cool addition to Single Page Apps and they definitely increase the wow-factor - as long as the animations are well planned and not overused.

In my demo here the animation is added for the whole visible part of the app, but it could we also added to a smaller part of the UI. For example everything below navigation bar, contents of a tab navigation or pretty much anything the has components changing from one to another.

The `react-transition-group` makes the transition itself rather simple, though there are multiple options to choose from. I recommend taking a look on their documentation.

The biggest issue might be handling layout of the `exiting` and `entering` components as they are rendered at the same time.

**TIP** the same approach used here could be used to animate things like model dialogs etc. The difference is there is only one component at the time. I might write a post about that later...

**Feel free to browse the code, if you have any questions or improvement ideas let me know!**

## Author

Timo Kallela, for more information please visit my [GitHub profile](https://github.com/kallelat)

You can also contact me by [email](mailto:timo.kallela@gmail.com) or via [LinkedIn](https://www.linkedin.com/in/kallelat/)!

## License

Contents of this repository is licensed under [MIT](LICENSE) license.
