# Box Link Editor

Simple web application for creating and linking boxes with lines.

## Setup

1. Clone the repository.   
2. Run `cd componenteditor`   
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

## With Docker
To dockerize the app:   
docker build -t componenteditor .   
docker run -d -it -p 5019:3000 --restart unless-stopped --name componenteditor-app componenteditor


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
participant App as "App.js"
participant Canvas
participant Hook as "useCanvas"

User -> Toolbar: Select box tool
Toolbar -> App: Notify tool selection
App -> Canvas: Set selectedTool to "box"
User -> Canvas: Click on canvas\n(x, y) #red
Canvas -> App: Trigger addBox(x, y)
App -> Hook: addBox(x, y) #blue
Hook -> App: Box added at\n(x, y)
App -> Canvas: Update canvas with new box
@enduml
```

### Edit property of Box
```plantuml
@startuml
actor User
participant Canvas
participant App as "App.js"
participant Box
participant PropertiesPanel
participant Hook as "useCanvas"

User -> Canvas: Click on a box to select it #red
Canvas -> App: Notify box selection
App -> Hook: setSelectedBox(boxId) #blue
Hook -> App: Update selected box in state
App -> PropertiesPanel: Display selected box details
User -> PropertiesPanel: Edit box name #green
PropertiesPanel -> App: Trigger updateBox(boxId, { name: newName }) #orange
App -> Hook: updateBox(boxId, { name: newName })
Hook -> App: Box name updated
App -> Canvas: Update box name on canvas
@enduml
```

### Delete Box
```plantuml
@startuml
actor User
participant Canvas
participant App as "App.js"
participant Hook as "useCanvas"

User -> Canvas: Click on a box to select it #red
Canvas -> App: Notify box selection
App -> Hook: setSelectedBox(boxId) #blue
User -> App: Press Delete Key #green
App -> Hook: deleteBox(boxId) #orange
Hook -> App: Box deleted
App -> Canvas: Remove box from canvas
@enduml
```

### Create Line
```plantuml
@startuml
actor User
participant Toolbar
participant App as "App.js"
participant Canvas
participant Box
participant Hook as "useCanvas"
participant Line as "Line.jsx"

User -> Toolbar: Select line tool
Toolbar -> App: Notify tool selection
App -> Canvas: Set selectedTool to "line"

User -> Box: Click on first box
Box -> Canvas: Notify box selection
Canvas -> App: Set lineStartBoxId(firstBoxId)
App -> Hook: Store startBoxId

User -> Box: Click on second box
Box -> Canvas: Notify box selection
Canvas -> App: Set lineEndBoxId(secondBoxId)
App -> Hook: addLine(startBoxId, secondBoxId)
Hook -> App: Line created between boxes
App -> Canvas: Trigger line rendering
Canvas -> Line: Render line between boxes
Line -> Canvas: Line drawn on canvas
@enduml
```