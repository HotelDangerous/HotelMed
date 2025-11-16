# Components & JSX
**The React Native mantra: Everything is a a component.**

## Components
The building blocks of any React Native application.

### What is a component?
At its core, a *component* is a function that returns UI. Rather than writing some HTML, you write functions, and the functions return **JSX**. Every button, card, header, modal... is a component. Here is an **Example Component:**

```jsx
function App() { 
    return (
        <text>Hello!</text>
    );
}
```
Note that the returned JSX is inside parenthesis followed by a semi-colon. This is also one of the simplest, complete, React Native applications that you could make. Once you understand components, you can understand everything else, because *state*, *hooks*, *lists*, *navigation* all live inside components. And components are just functions.

JSX is not HTML. Though it looks similar to HTML, it is something else entirely. Depending on the platform it is deployed to, a `<text>` tag may become a "real native text widget", a "UILabel", or `<p>|| <div>` for android, ios, and web respectively.

### Example 
We can build entire screens using this pattern:
- Make a function
- Return JSX 
- Put style inside JSX 
- combine components like LEGO bricks
That is pretty much how React Native apps grow.
```jsx
function WelcomeCard() {
    return (
        <View style={{ padding: 20, backgroundColor: "black" }}>
            <Text style={{ color: "white" }}Welcome!</text>
            <Text style={{ color: "gray" }}>Glad you're here.</Text>
        </View>
    );
}
```
## Props & Reusable Components 
**Props** are inputs to a component; they allow you to pass data *into* a component so it can behave differently depending on the prop received. Props are exactly like function parameters and we can think of them ans arguements to a function. 

Suppose we had a simple JavaScript function:
```js 
function greet(name) {
    console.log("Hello " + name);
}
```
We would call it with `greet("HotelDangerous");`. In React Native components work the same:
```jsx
function Greeting(props) {
    return <Text>Hello {props.name}</Text>;
}

<Greeting name="HotelDangerous"/>
```
Here, React passes `{ name: "HotelDangerous" }` into the component as *props*. We access the name `"HotelDangerous"` by writting `props.name`-- getting the name attribute that we set.

### Why are Props Important?
Props allow you to write one component and reuse it many different situations. Suppose we wanted a pink button with white text and we wanted that button to be used prolifically throughout our application. It would be a pain to write the "boiler plate" for our pink button over and over. Props avoid this by allowing us to define a component, which we will call `PinkButton`, then define the text we want displayed using a prop. For example, if we were building a medicine alarm app and wanted a button for *Save*, *Delete*, and *Add Medicine* we could create those quickly as follows:
```jsx
function PinkButton(props) {
    return(
        <TouchableOpacity style={{ background: "#C80085", padding: 10 }}>
            <Text>props.text</Text>
        </TouchableOpacity>
    );
}

<PinkButton text="Save"/>
<PinkButton text="Delete"/>
<PinkButton text="Add Medicine"/>
```
>[!NOTE]
>It is not important what `TouchableOpacity` means, right now, but if you are interested:
>`TouchableOpacity` is one of the touchable components in React broadly used for registering touch or press events (such as buttons or cards). This component fades out when pressed and fades back in when released.
Same component, different text. This is how apps are built.

It is very common to see a technique called *destructuring* on props. Essentially it is a more expressive way to show what information your function is expecting from the prop. If we wanted to write the same function as above, destructuring the prop, we would replace `props` with `{ text }`. Then we can use `name` in place of `props.text` within the function body.
```jsx
function PinkButton({ text }) {
    return(
        <TouchableOpacity style={{ background: "#C80085", padding: 10 }}>
            <Text>props.text</Text>
        </TouchableOpacity>
    );
}

<PinkButton text="Save"/>
<PinkButton text="Delete"/>
<PinkButton text="Add Medicine"/>
```
This may look sort of funny, but when remember that `props = { text: "some text" }` this begins to look more natural.

>[!WARNING]
>Props are **read only**. You cannot change props inside of a component.

