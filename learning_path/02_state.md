# State (`useState`)
We know that components return UI, props pass data *into* components, and that props cannot be changed within the component. Now we cover the flip side. **State** is data inside a component that React *remembers*. Similar to props, how our app behaves may—and probably does—depend on the *current state*.

## What is State?
State is data that belongs to a component and can change over time. While props are data passed from outside a component, state is “memory” inside a component. State allows our apps to be dynamic. With it we can track user input, expand and collapse sections, count clicks, update lists, toggle buttons, and much more.

## The `useState` Hook
This is the most important line of code in React:

```jsx
const [value, setValue] = useState(initialValue);
```

Where:
- `value` is the current state  
- `setValue` is a function that updates the state  
- `useState()` is a hook that creates component memory  
- `initialValue` is the starting value  

For example, if we have a counter and want to start at zero:

```jsx
const [count, setCount] = useState(0);
```

React now remembers the number for this component.

In React, you **never** update state directly. You will never write:

```js
count = count + 1;
```

Because React must know when the value changes so it can re-render the UI. Instead, we **always** write:

```js
setCount(count + 1);
```

This notifies React that the component should re-render with new data.

---

### Example: Incrementing a Count When a Button Is Pressed

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}
```

1. User presses the button  
2. `setCount(count + 1)` runs  
3. React re-renders  
4. UI updates and shows the new count  

---

## What Are Hooks?
Hooks are special React functions that let components store values, run code at specific times, and respond to changes. They allow React to remember data across re-renders without you manually tracking anything.  

When state updates, React uses hooks to recall previous values, compute the new UI, and update the screen automatically.
