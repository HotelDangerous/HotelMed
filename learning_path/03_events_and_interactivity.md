# Events and Interactivity
Previously, we learned about *state*. We know that state is data that is remembered by a component and we know that the component re-renders when the state changes. But what causes the state to change? **Events**.

## What is an Event?
An **event** occurs whenever the user interacts with a component. For example: the user taps a button, types input, opens or closes a modal, swipes, scrolls, selectings a time, or toggels a switch, etc.. Interactive components have an *event handler* which runs a function whenever an event happens. The most common event is `onPress()`.

When the user taps a button, React calls the function that the component was given. For example, a button that prints `"pressed"` whenever you tap it.

```jsx
<TouchableOpacity onPress = { () => console.log("Press me")}>
    <Text>Tap me!</Tap>
</TouchableOpacity>
```

### Interaction = State + Events 
When a user presses a button that calls an event-- an **interaction** just occured. For each interaction the following few things will happen:
- 1. User triggers an event 
- 2. Event calls a function 
- 3. Function updates the state 
- 4. React re-renders the component 

> [!NOTE]
> **Arrow Functions** are prolific in React and look something like: `onPress={()=>setCount(count+ 1)}`.
> These funny looking functions allow us to run code *later* --like when an event occurs and not at page load.


### Events can Receive Arguments
Suppose we plan to have a bunch of pink buttons in our app and we know that these buttons will display different text on them. We could write a piece of reusable UI, that accepts both a label and a function as arguments:
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
function PinkButton( {label, onPress} ) {
    return(
        <TouchableOpacity onPress={onPress} style={ pinkButtonStyle }>
            <Text>{label}</Text>
        </TouchableOpacity>
    );
}

// ...Using it later 
<PinkButton label="Save" onPress={ () => setSave(true) }/>
```
> The `style` stuff is not important right now

