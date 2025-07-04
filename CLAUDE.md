# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

show me a complete diagram of the project

*Session: ad4cf2626aedcb3482ea45638c73f750 | Generated: 7/4/2025, 12:32:13 PM*

### Analysis Summary

# Project Architecture Diagram

This project is a Playwright-based test automation framework, primarily structured around the **Screenplay Pattern**. This pattern promotes maintainable and scalable test suites by separating *who* performs actions (**Actors**), *what* they can do (**Abilities**), *how* they achieve goals (**Tasks**), and *what* information they need (**Questions**).

## High-Level Architecture

The core of the automation framework resides within the [tests/](tests/) directory, which encapsulates all the components necessary for defining, executing, and organizing automated tests. The tests are written as [specs](tests/specs/), which orchestrate **Actors** to perform **Tasks** and answer **Questions** using their **Abilities** to interact with **Pages**.

## Core Components

### **Tests Specifications** [specs/](tests/specs/)
This directory contains the actual test files, often referred to as "specs." Each spec defines a test scenario, outlining the steps an **Actor** will take and the assertions to be made.
*   **Purpose**: To define individual test cases and orchestrate the flow of test execution.
*   **Internal Parts**: Contains individual test files (e.g., [encargadoFlujoCupones.spec.ts](tests/specs/encargadoFlujoCupones.spec.ts), [login.spec.ts](tests/specs/login.spec.ts)).
*   **External Relationships**: Imports **Actors**, **Tasks**, and **Questions** to build test scenarios.

### **Actors** [actors/](tests/actors/)
Actors represent the different types of users or roles interacting with the application under test. They are assigned **Abilities** and perform **Tasks**.
*   **Purpose**: To model user roles and their capabilities within the system.
*   **Internal Parts**: Defines specific actor types (e.g., [Encargado.ts](tests/actors/Encargado.ts), [Vendedor.ts](tests/actors/Vendedor.ts)).
*   **External Relationships**: Utilizes **Abilities** to interact with the application and performs **Tasks**.

### **Abilities** [abilities/](tests/abilities/)
Abilities define what an **Actor** can do. For a web application, a common ability is `BrowseTheWeb`, which allows an actor to interact with a web browser.
*   **Purpose**: To encapsulate the means by which an actor interacts with the system (e.g., browsing a web page, making API calls).
*   **Internal Parts**: Contains definitions of various abilities (e.g., [BrowseTheWeb.ts](tests/abilities/BrowseTheWeb.ts)).
*   **External Relationships**: Provided to **Actors** to enable them to perform actions.

### **Tasks** [tasks/](tests/tasks/)
Tasks are sequences of actions that an **Actor** performs to achieve a specific goal. They represent the "how" in the Screenplay pattern. Tasks can be composed of smaller tasks or direct interactions with **Pages**.
*   **Purpose**: To define reusable sequences of actions that actors can perform.
*   **Internal Parts**: Contains various tasks, often organized by actor or feature (e.g., [Login.ts](tests/tasks/Login.ts), [CrearCuponDni.ts](tests/tasks/Encargado/CrearCuponDni.ts)).
*   **External Relationships**: Performed by **Actors** and interact with **Pages**.

### **Questions** [questions/](tests/questions/)
Questions define how an **Actor** can query the state of the application. They represent the "what" in terms of information retrieval for assertions.
*   **Purpose**: To define how actors can retrieve information from the application for verification.
*   **Internal Parts**: Contains definitions of questions (e.g., [VerBienvenida.ts](tests/questions/VerBienvenida.ts), [VerConfirmacionCupon.ts](tests/questions/VerConfirmacionCupon.ts)).
*   **External Relationships**: Answered by **Actors** to facilitate assertions in **Specs**.

### **Pages** [pages/](tests/pages/)
This directory implements the Page Object Model (POM), where each file represents a page or a significant component of the web application. It encapsulates the locators and interactions for that specific part of the UI.
*   **Purpose**: To provide an abstraction layer for interacting with web pages, making tests more readable and maintainable.
*   **Internal Parts**: Contains page object definitions (e.g., [LoginPage.ts](tests/pages/LoginPage.ts), [CrearCuponDniPage.ts](tests/pages/CrearCuponDniPage.ts)).
*   **External Relationships**: Used by **Tasks** to interact with specific UI elements.

### **Helpers** [helpers/](tests/helpers/)
This directory contains utility functions or modules that support the test automation framework but don't fit directly into the core Screenplay components. These might include common assertions, data generators, or custom Playwright locators.
*   **Purpose**: To provide reusable utility functions and common components for the test framework.
*   **Internal Parts**: Contains various helper modules (e.g., [loginmodals.ts](tests/helpers/loginmodals.ts), [CuponModals.ts](tests/helpers/CuponModals.ts)).
*   **External Relationships**: Can be used by **Tasks**, **Questions**, or **Pages** as needed.

## Relationships and Data Flow

The flow of a test scenario typically follows this path:

1.  A **Spec** [specs/](tests/specs/) initiates a test by creating an **Actor** [actors/](tests/actors/).
2.  The **Actor** is given **Abilities** [abilities/](tests/abilities/) (e.g., `BrowseTheWeb`).
3.  The **Actor** then performs **Tasks** [tasks/](tests/tasks/) (e.g., `Login`, `CrearCuponDni`).
4.  **Tasks** interact with the application primarily through **Pages** [pages/](tests/pages/), which encapsulate UI interactions.
5.  After performing actions, the **Actor** can answer **Questions** [questions/](tests/questions/) to retrieve information from the application's state.
6.  The retrieved information is then used within the **Spec** for assertions to verify the expected behavior.
7.  **Helpers** [helpers/](tests/helpers/) provide supporting functionalities across various components.

This structure ensures a clear separation of concerns, making the test suite more robust, readable, and easier to maintain as the application evolves.

