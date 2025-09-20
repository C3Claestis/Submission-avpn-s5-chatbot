const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Array to store the conversation history
let conversationHistory = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to UI and history
  appendMessage('user', userMessage);
  conversationHistory.push({ role: 'user', message: userMessage });
  input.value = '';

  // Show a temporary "Thinking..." message and get a reference to it
  const thinkingMessage = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the entire conversation history
      body: JSON.stringify({
        conversation: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      // Update the "Thinking..." message with the actual AI response
      thinkingMessage.textContent = result.data;
      // Add AI response to history with the 'model' role
      conversationHistory.push({ role: 'model', message: result.data });
    } else {
      // Handle cases where the API returns success:false or no data
      thinkingMessage.textContent = result.message || 'Sorry, no response received.';
      // If the request failed, remove the last user message from the history
      // to allow for a clean retry.
      conversationHistory.pop();
    }
  } catch (error) {
    console.error('Failed to get response from server:', error);
    // Update the "Thinking..." message with a user-friendly error
    thinkingMessage.textContent = 'Failed to get response from the server.';
    // If the request failed, remove the last user message from the history
    // to allow for a clean retry.
    conversationHistory.pop();
  } finally {
    // Ensure the chat box is scrolled to the bottom to show the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

/**
 * Appends a new message to the chat box.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The message text.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element to allow for future updates
}
