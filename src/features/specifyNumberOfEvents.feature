Feature: Specify number of events

Scenario: When user hasn’t specified a number, 32 is the default number
Given events list is shown on screen
When user hasn’t specified a number of events to show in the Number of Event textbox
Then 32 is default number in Number of Event textbox

Scenario: User can change the number of events they want to see
Given user has specified a number of events to show
When user change number in Number of Event text box to a new number
Then number of events on events list should be changed to number the user specifies
