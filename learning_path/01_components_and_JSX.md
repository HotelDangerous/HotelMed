# Components & JSX
**The React Native mantra: Everything is a component.**

## Components
The building blocks of any React Native application.

### What is a component?
At its core, a **component** is a function that returns UI.  
Rather than writing HTML, you write functions that return **JSX**.

Every button, card, header, modal — everything — is a component.

**Example Component:**

```jsx
function App() { 
  return (
    <Text>Hello!</Text>
  );
}
```

The returned JSX is wrapped in parentheses, and the function itself is just plain JavaScript.  

Once you understand components, everything else falls into place — because **state**, **hooks**, **lists**, and **navigation** all live inside components.

JSX is *not* HTML. Though it resembles HTML, JSX gets transformed depending on the platform. A `<Text>` element may render as a native iOS UILabel, an Android TextView, or `<p>` on web.

---

### Example
We can build entire screens using this pattern:

- Make a function  
- Return JSX  
- Put styling inside the JSX  
- Combine components like LEGO bricks  

This is how React Native apps grow.

```jsx
function WelcomeCard() {
  return (
    <View style={{ padding: 20, backgroundColor: "black" }}>
      <Text style={{ color: "white" }}>Welcome!</Text>
      <Text style={{ color: "gray" }}>Glad you're here.</Text>
    </View>
  );
}
```

---

## Props & Reusable Components
**Props** are inputs to a component.  
They allow you to pass data *into* a component so it can behave differently depending on what it receives.

Props are just **function parameters**.

Example in plain JavaScript:

```js
function greet(name) {
  console.log("Hello " + name);
}

greet("HotelDangerous");
```

Components are identical in spirit:

```jsx
function Greeting(props) {
  return <Text>Hello {props.name}</Text>;
}

<Greeting name="HotelDangerous" />;
```

React passes `{ name: "HotelDangerous" }` into your component as `props`.

---

### Why are Props Important?
Props let you reuse the same component in many situations.

Imagine we want a pink button to use throughout the app. Rather than rewriting the same boilerplate every time, we create a single component and give it a prop for the text.

```jsx
function PinkButton(props) {
  return (
    <TouchableOpacity style={{ backgroundColor: "#C80085", padding: 10 }}>
      <Text>{props.text}</Text>
    </TouchableOpacity>
  );
}

<PinkButton text="Save" />
<PinkButton text="Delete" />
<PinkButton text="Add Medicine" />
```

Same component, different text. This is the core of component reuse.

---

## Destructuring Props
You’ll often see props **destructured** to make the code cleaner.

```jsx
function PinkButton({ text }) {
  return (
    <TouchableOpacity style={{ backgroundColor: "#C80085", padding: 10 }}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

<PinkButton text="Save" />
<PinkButton text="Delete" />
<PinkButton text="Add Medicine" />
```

Instead of writing `props.text`, we extract the `text` property directly:  
`props = { text: "…" }` → `function PinkButton({ text })`.

---

> **Props are read-only.**  
> You cannot modify props inside a component. Use state for that.
