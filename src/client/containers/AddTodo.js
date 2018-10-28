import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'
import io from "socket.io-client"

var socket;

const AddTodo = ({ dispatch }) => {
  let input
  socket = io();

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }

        dispatch(addTodo(socket, input.value))
        input.value = ''
      }}>
        <input ref={node => input = node} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

export default connect()(AddTodo)
