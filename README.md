# XWord
XWord is a crossword puzzle app that challenges your knowledge of various pop culture topics. Movies, games, books, TV Shows--;it's all on the table! XWord is a MERN Stack application.

## Deployment

### FRONT END
- [XWord on NETLIFY](https://xword-app-beta.netlify.app/)

### BACK END: HEROKU
- [XWORD on HEROKU](https://xword-app.herokuapp.com/api)

### Endpoints
https://xword-app.herokuapp.com/api

- `/puzzles` returns all puzzles
- `/puzzles/:id` returns the puzzle specified by `:id`
- `/comments` returns all comments
- `/comments/:id` returns the comment specified by `:id`

## Controls:

- [BACKSPACE]: delete cell entry/go back a cell
- [ARROWS]: navigate the puzzle grid
- [TAB]: move to next cell in word group
- [ENTER]: move to next word group
- [SPACE]: toggle word group
- [SHIFT] + [ARROW]: move to first cell of word group

## MVP

- Play a variety of crowssword puzzle games
- Leave comments/likes on puzzles
- Create new puzzles

## POST MVP

- Light/dark mode
- User puzzles

## Dependencies:

- Axios
- Express
- Mongoose
- Morgan

