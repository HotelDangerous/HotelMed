# State (`useState`)
We know that components return UI, props pass data *into* components, and that props cannot be changed within the component. Now we cover the flip side. **State** is data inside a component that React *remembers*. Similar to props how our app behaves may, and probably does, depend on the *current state*.

## What is State?
State is data that belongs to a component and can change over time. Where props are data passed from outside a component, state is "memory" inside a component. State allows our apps to be dynamic. Using it we can track user input, expand and collapse things, count clicks, update lists, toggle buttons, and so much more.

## The `useState` Hook
This is the most important line of code in React:
```jsx
const [value, setValue] = useState(initialValue);
```
where 
- `value` is the current state;
- `setValue` is a function that updates the state;
- `useState()` is a hook that creates component memory;
- `initialValue` is the starting value.

For example if we had a counter and we wanted to start that count at zero, we might write `const [count, setCount] = useState(0);`. React now remembers the number for this input.

In react, you **never** update the state directly. We will never see `count = count + 1;`, because react needs to know when the value changes so that it can re-render the UI. Instead we will **always** see something like `setCount(count + 1);` notifing React that this component needs to be re-rendered with new data.

### Example: Incrementing a Count when Button is Pressed
```jsx
function Counter() {
    const [count, setCount] = useState(0);
    return (
        <View>
            <Text>{count}</Text>
            <Button title="Increment" onPress={() => setCount(count+1)} />
        </View>
    );
}
```
1. User presses button.
2. `setCount(count+1)` runs 
3. React re-renders
4. UI shows the updated count 

#### What are Hooks?
Hooks are special React functions that let components store values, run code at specific times, and respond to changes. They let React remember data between re-renders without you having to manually track anything. When state updates, React uses hooks to recall the previous values, calculate the new UI, and update the screen.
