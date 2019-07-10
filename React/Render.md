# 模拟实现 React Render 过程

## 关于点赞和取消功能的例子

通过编写一个可以传入参数的通用点赞取消功能组件，来模拟实现 Render 的过程。

```html
<div class="wrapper"></div>
```

```js
// 先封装一个组件类
class Component {
  constructor(props = {}) {
    this.props = props;
  }
  setState(start) {
    const oldEl = this.el;
    this.state = state;
    this._renderDOM();
    if(this.onStateChange) {
      this.onStateChange(oldEl, this.el);
    }
  }
  _renderDOM() {
    this.el = createDOMFromString(this.render());
    if(this.onClick) {
      this.el.addEventListener('click', this.onClick.bind(this), false);
    }
    return this.el;
  }
};
// 基于组建类继承而来的按钮类
class LikeButton extends Component {
  constructor() {
    super(props);
    this.state = {isLiked: false};
  }
  onClick() {
    this.setState({ isLiked: !this.state.isLiked });
  }
  render() {
    return `
      <button style="background-color: ${this.props.bgColor}">
        <span class="like-text">${this.state.isLiked ? "取消" : "点赞"}</span>
        <span>👍</span>
      </button>
    `;
  }
};
// 构造 DOM 的功能函数
const createDOMFromString = domString => {
  const div = document.createElement('div');
  div.innerHTML = domString;
  return div;
};
// 渲染页面的函数
const mount = (component, wrapper) => {
  wrapper.appendChild(component._renderDOM());
  component.onStateChange = (oldEl, newEl) => {
    wrapper.insertBefore(newEl, oldEl);
    wrapper.removeChild(oldEl);
  }
};
// 进行页面渲染
const wrapper = document.querySelector('.wrapper');
const likeButton = new LikeButton({ bgColor: 'red' });
mount(likeButton, wrapper);
```
