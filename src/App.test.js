import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('renders charts without crashing', () => {
  const div = document.createElement('div')

  const wrapper = Enzyme.shallow(<App />)
  wrapper.setState({ queryString: 'expenses' })

  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
