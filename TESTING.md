## Component Testing

For the component testing part of the assignment, I aimed to ensure comprehensive coverage by testing key functionalities and various components of the application. Below, I will outline my approach:

### Approach to Component Testing

The testing was primarily conducted using `@testing-library/react` for rendering components and checking their behaviors and outputs. I chose to break the components down into simple, isolated tests to ensure maximum coverage. All input fields, buttons, and modals were tested for both happy and edge cases (such as invalid data).

The use of mock functions (e.g., `jest.fn()`) enabled us to verify side effects, particularly for functions like navigation and handling input events.

### 1. LoginPage Component

- **Purpose**: The `LoginPage` component allows users to log in to the application by providing valid credentials.
- **Tests Written**:
  - **Rendering the Login Button**: Ensured the "Login" button is rendered correctly when the component is loaded. This was tested using the `renderWithRouter` function to wrap the component in `BrowserRouter` so that the `useNavigate` hook would work seamlessly.
  - **Proper Styles for the Login Button**: Verified that the button has appropriate styles, including background color, text color, and border radius.
  - **Handle Button Click**: Ensured the login button click event navigates to the dashboard page. I mocked `useNavigate` to check whether it was called with the expected route.

### 2. AddText Component

- **Purpose**: This component adds a text element to a slide in the presentation.
- **Tests Written**:
  - **Render Modal on Button Click**: Verified that clicking the "Add Text" button correctly opens the modal for adding text.
  - **Add Text and Display**: Checked that a new text element is added to the slide upon confirming the modal input.
  - **Edit Text Properties**: Verified that the user can edit the existing text properties (like size, position, and color) after double-clicking.

### 3. AddImage Component

- **Purpose**: This component is responsible for adding an image element to a slide.
- **Tests Written**:
  - **Add Image from URL**: Ensured that the user is able to add an image by providing a URL.
  - **Edit Image Properties**: Verified that the user can modify image size, position, and alt text.

### 4. AddVideo and AddCode Component

- **Purpose**: This component is responsible for adding an video and code element to a slide.
- **Tests Written**:
  - **Add Video & Code from URL**: Ensured that the user is able to add an video or code by providing a URL.
  - **Edit Video & Code Properties**: Verified that the user can modify video or code size and URL.

## UI Testing

For the UI testing, I used Cypress to validate the user journey throughout the application, focusing on the "happy path" of an admin performing various tasks. Below, I will describe my approach to writing these tests:

### 1. The Path Testing for Admin

- **Purpose**: To ensure that an admin user can successfully interact with the key features of the application.
- **Steps Covered**:
  - **Register Successfully**: The admin user starts by registering with valid credentials. This was tested by filling in the registration form and submitting it to verify that the user is redirected to the dashboard.
  - **Create a New Presentation**: Once logged in, the admin user can create a new presentation successfully. The Cypress script covers filling in the presentation title and verifying that it appears in the dashboard list.
  - **Update Thumbnail and Name**: The test checks if the thumbnail and name of the created presentation can be updated, and verifies that the changes are reflected in the UI.
  - **Add Slides to Presentation**: Tested adding multiple slides to the presentation to ensure that the user can switch between them easily and they are rendered correctly.
  - **Navigate Between Slides**: Verified that the arrow buttons allow users to navigate between slides as expected.
  - **Delete Presentation**: Checked that a presentation can be deleted successfully and is removed from the dashboard.
  - **Log Out and Log Back In**: Ensured that the admin user can log out and log back in with the same credentials to access the previous presentation data.

### 2. Alternative Path Testing

For the alternative path, I tested the behavior of users attempting to add and edit multiple text, image, and video elements across different slides. The rationale behind this choice is to verify how well the application handles multiple elements being added, edited, and deleted, especially when there are different types of components in a slide. The following steps were tested:
- **Add Text, Image, Video and Code**: Added various text, image, and video elements to multiple slides, verified correct rendering, and ensured all properties were retained when switching slides.
- **Edit and Delete Elements by OnClick or DoubleClick**: Ensured the user can edit and delete elements, and that changes are consistently reflected.


## Summary

- **Component Testing**: Focused on small, individual components to ensure they function correctly in isolation.
- **UI Testing**: Covered the complete journey of an admin user, validating all major actions within the application.