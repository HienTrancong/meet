Feature: Show/hide event details

Scenario: An event element is collapsed by default
Given upcoming events are shown on screen
When the user hasn’t clicked on show details button on an event element
Then the event element should be collapsed by default and show only main information

Scenario: User can expand an event to see its details
Given upcoming events are shown on screen
When the user clicks on show details button on an event element
Then the event element should be expanded to show more detail information

Scenario: User can collapse an event to hide its detail
Given the user has clicked on show details button and more detail information is being shown
When the user click on hide detail button on the expanded event element
Then the event element should be collapsed to and show only main information