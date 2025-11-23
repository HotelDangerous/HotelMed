# Controlled Inputs

A **controlled input** is a text field whose value is *fully* controlled by React through state.  
This means the text the user sees **comes from state only**. Every time the user types:

1. The input fires an event  
2. State updates  
3. React re-renders  
4. The input displays the updated state  

```jsx
const [name, setName] = useState("");

<TextInput
  value={name}
  onChangeText={newValue => setName(newValue)}
/>
```

Without controlled inputs, we would not be able to read what the user typed, validate it, submit forms, reset fields, or build flows like “Add Medicine.” Controlled inputs are essential.

---

## How `TextInput` Works

Returning to the example above:

- `value` represents the current text from state  
- `onChangeText` receives the latest text the user typed  
- `setName(newValue)` updates state  
- React re-renders and the `value` updates the visible text  

> We don’t read the input directly — **we read the state that mirrors the input.**

---

## Correct Example: Controlled Username Input

Below is a corrected and fully working version of the component.  
Your original snippet had a few issues:
- `<textInput>` should be `<TextInput>`
- The placeholder had a typo
- `onChangeText` must accept the new text
- You displayed `"username"` literally instead of using `{username}`

Here is the fixed version:

```jsx
function UsernameInput() {
  const [username, setUsername] = useState("");

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={newValue => setUsername(newValue)}
        placeholder="Enter username"
      />
      <Text>Current username: {username}</Text>
    </View>
  );
}
```

This is the standard controlled-input pattern in React Native.

