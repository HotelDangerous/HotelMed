# Events and Interactivity
Previously, we learned about *state*. We know that state is data that is remembered by a component and we know that the component re-renders when the state changes. But what causes the state to change? **Events**.

## What is an Event?
An **event** occurs whenever the user interacts with a component. For example: the user taps a button, types input, opens or closes a modal, swipes, scrolls, selects a time, or toggles a switch. Interactive components have an *event handler* which runs a function whenever an event happens. The most common event is `onPress`.

When the user taps a button, React calls the function given to that component. For example, a button that prints `"Press me"` whenever you tap it:

```jsx
<TouchableOpacity onPress={() => console.log("Press me")}>
  <Text>Tap me!</Text>
</TouchableOpacity>
```

## Interaction = State + Events
When a user presses a button that fires an event, an **interaction** has occurred. For each interaction, the following steps happen:

1. User triggers an event  
2. Event calls a function  
3. Function updates the state  
4. React re-renders the component  

> **Note:**  
> **Arrow functions** are common in React and look like:  
> `onPress={() => setCount(count + 1)}`  
> These functions allow us to run code *later*—such as when an event occurs—rather than immediately when the component loads.

---

## Events Can Receive Arguments
Suppose we plan to have many pink buttons in our app, each with different text and behavior. We can create a reusable UI component that accepts both a label and a function as arguments:

```jsx
// Pink Button Style
const pinkButtonStyle = {
  backgroundColor: "#C80085",
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center"
};

// Pink Button Component
function PinkButton({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={pinkButtonStyle}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

// ...Using it later
<PinkButton label="Save" onPress={() => setSave(true)} />
```

> The `style` details are not important right now.
