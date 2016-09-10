# TodoMVC - vanilla JS

## Questions for next Meetup
Hi everyone! The time difference makes it impossible for me to attend, so I agreed with Gordon to post some comments and questions regarding my attempt to make the TodoMVC app.

## Comments
I started the app like the practical javascript course is in it's current state, but I wrote the code from scratch. So first I added the logic to add, delete and change todos. Then I went on adding the toggle complete and toggle-all functions. I ended up not splitting the view logic, event logic and todos logic though.

After that I wrote a function to render the page. The render() function basically binds the contents of the app.todo[] to the page(as I would call it). Then I added extra stuff to complete the specs from the TodoMVC template specs(app-spec.md in the TodoMVC repo).

The order in the app object is basically:

1.  Init (setup event listeners)
2.  Template functions(hide/show footer and stuff)
3.  render() function
4.  Todos functions

The util object contains the storage, pluralize, router and uuid functions. I think most of it is comprable to the jQuery version, but I added my own router logic so I didn't have to use any external libraries. Routers are not that hard! Gordon says something about it in one of his videos(can't remember which one), that the hash-urls don't cause a full page reload. I found an event lister for it and voila.

Also editing a todo works, just double click the todo-text.

## Questions
### Helpers
I wrote two helpers to get and create elements. The creEl(create element) takes an object as an argument in which you can define optional aatributes to the element. Is this a good approach? Or should you set those attributes in the app logic after the element is created?

Side note: when I did this, I realized I was doing basically what jQuery is... a helper library. I read a blog somewhere last week which was basically a rant that developers choose to use libraries when not needed. Could have been written by Gordon:)

### router function
I basically would like to know if the router setup is actually how it should be. I ran into an issue with the onscreen todos were cleared when I refreshed the page twice. That why I added an 'window.onload' event listener(line 59). 

### UUID generator
The uuid now generates a random string but it's just numbers. I'd like to know how to (randomly) throw some letters in there

### getFilterdTodos
I gave all the links in the footer(all, active, completed) an ID in the html and assigned them a variable that I then use to set the className on the dom elements. Did I do this right, or is there a better way?

This question also kind of goes for the countTodos and checkCompleted functions.

### render()
Eventhough it works(as far as I have tested), it seems a bit long to me. Any suggestions to shorten it or split it up?

### overall structure
Like I said in the intro, I didn't split up the app in a strict data, view and evenhandlers logic, it's all now basically in the app object. Could this be improved?

### TDD
Can you(Gordon) give an example on how you would write a test for any part of the app.js? I doesn't have to be DOM related, but I'm curious to how you would integrate a test in this, as large part of the app is depending on HTML elements being present. It will probably be a simple thing to do, but I don't see where to start, I'm missing that link to TDD.