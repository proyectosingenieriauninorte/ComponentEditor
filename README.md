# Box Link Editor

A simple web application for creating and linking boxes with lines.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

## Usage

- Double-click on a box to edit its name.
- Click and drag the small circle at the bottom right of a box to start drawing a line to another box.
- The lines represent relationships between the boxes.

## Sequence Diagram

### Create Box
```plantuml
@startuml
actor User
participant Toolbar
participant Canvas
participant Hook as "useCanvas"

User -> Toolbar: Select box tool
Toolbar -> Canvas: Set selectedTool to "box"
User -> Canvas: Click on canvas\n(x, y) #red
Canvas -> Hook: addBox(x, y) #blue
Hook -> Canvas: Box added at\n(x, y) #green
@enduml
```

### Edit property of Box
```plantuml
@startuml
actor User
participant Canvas
participant Box
participant PropertiesPanel
participant Hook as "useCanvas"

User -> Canvas: Click on a box to select it #red
Canvas -> Box: Notify box is selected
Box -> Hook: setSelectedBox(boxId) #blue
Hook -> PropertiesPanel: Display selected box details
User -> PropertiesPanel: Edit box name #green
PropertiesPanel -> Hook: updateBox(boxId, { name: newName }) #orange
Hook -> Canvas: Update box name on canvas
@enduml
```