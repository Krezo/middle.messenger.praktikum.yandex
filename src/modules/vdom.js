export const createVNode = (tagName, props = {}, children = []) => {
  return {
    tagName,
    props,
    children,
  };
};

export const createDOMNode = vNode => {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  const { tagName, props, children } = vNode;

  const node = document.createElement(tagName);

  Object.entries(props).forEach(([key, value]) => {
    const val = value.replace(/\s+/, ' ').trim();
    node.setAttribute(key, val);
  });

  children.forEach(child => {
    node.appendChild(createDOMNode(child));
  });

  return node;
};

// export const findTagNameVTree = (tagName, root) => {
//   return _findTagNameVTree(tagName, root, root);
// }

export const findChildrenIndex = (parent, child) => {
  return parent.children.findIndex(parentChild => parentChild == child);
}







