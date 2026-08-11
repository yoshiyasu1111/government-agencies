import './style.css';
import { japanGovData } from './data/ministries';
import type { OrgNode } from './data/ministries';

function getNodeStyle(type: OrgNode['type']): string {
  switch (type) {
    case 'cabinet':
      return 'bg-red-900 text-white border-red-700 shadow-md';
    case 'office':
      return 'bg-blue-900 text-white border-blue-700';
    case 'ministry':
      return 'bg-slate-800 text-white border-slate-600';
    case 'agency':
      return 'bg-white text-slate-800 border-slate-300 shadow-sm';
    default:
      return 'bg-white text-slate-800 border-slate-300';
  }
}

interface TreeNodeElement {
  element: HTMLElement;
  children: TreeNodeElement[];
  cardEl: HTMLElement;
}

// 超広大なスペース（横120px, 縦20px）を確実に確保するノード構築
function createNodeElement(node: OrgNode): TreeNodeElement {
  const container = document.createElement('div');
  container.className = 'flex items-center relative';
  // 縦方向のカード間隔を強制設定（20px）
  container.style.marginTop = '10px';
  container.style.marginBottom = '10px';

  const card = document.createElement('div');
  card.className = `w-[200px] p-8 rounded-lg border-2 text-left cursor-pointer transition-transform hover:scale-105 z-10 shrink-0 ${getNodeStyle(
    node.type
  )}`;

  const title = document.createElement('div');
  title.className = 'font-bold text-sm truncate';
  title.textContent = node.name;
  card.appendChild(title);

  if (node.role) {
    const role = document.createElement('div');
    role.className = 'text-xs opacity-80 mt-0.5 truncate';
    role.textContent = node.role;
    card.appendChild(role);
  }

  card.addEventListener('click', (e) => {
    e.stopPropagation();
    // alert(`${node.name} が選択されました。`);
  });

  container.appendChild(card);

  const childTreeElements: TreeNodeElement[] = [];

  if (node.children && node.children.length > 0) {
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'flex flex-col relative';
    // 親から子への横方向スペースを120pxで強制固定
    childrenContainer.style.marginLeft = '120px';

    node.children.forEach((child) => {
      const childTree = createNodeElement(child);
      childrenContainer.appendChild(childTree.element);
      childTreeElements.push(childTree);
    });

    container.appendChild(childrenContainer);
  }

  return {
    element: container,
    children: childTreeElements,
    cardEl: card,
  };
}

// 直角の接続線を中間地点（120pxの真ん中 = 60pxのライン）に引く
function drawOrthogonalLines(
  tree: TreeNodeElement,
  svg: SVGSVGElement,
  containerRect: DOMRect
) {
  if (!tree.children || tree.children.length === 0) return;

  const parentRect = tree.cardEl.getBoundingClientRect();
  const parentX = parentRect.right - containerRect.left;
  const parentY = parentRect.top + parentRect.height / 2 - containerRect.top;

  const firstChildRect = tree.children[0].cardEl.getBoundingClientRect();
  const childLeftX = firstChildRect.left - containerRect.left;
  
  // 120px開けた余白の中央（60px進んだ地点）を通る幹
  const trunkX = parentX + (childLeftX - parentX) / 2;

  // 1. 親からの横線
  const parentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  parentLine.setAttribute('x1', String(parentX));
  parentLine.setAttribute('y1', String(parentY));
  parentLine.setAttribute('x2', String(trunkX));
  parentLine.setAttribute('y2', String(parentY));
  parentLine.setAttribute('stroke', '#64748b');
  parentLine.setAttribute('stroke-width', '2');
  svg.appendChild(parentLine);

  // 2. 縦の幹
  const lastChildRect = tree.children[tree.children.length - 1].cardEl.getBoundingClientRect();
  const firstChildY = firstChildRect.top + firstChildRect.height / 2 - containerRect.top;
  const lastChildY = lastChildRect.top + lastChildRect.height / 2 - containerRect.top;

  const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  verticalLine.setAttribute('x1', String(trunkX));
  verticalLine.setAttribute('y1', String(firstChildY));
  verticalLine.setAttribute('x2', String(trunkX));
  verticalLine.setAttribute('y2', String(lastChildY));
  verticalLine.setAttribute('stroke', '#64748b');
  verticalLine.setAttribute('stroke-width', '2');
  svg.appendChild(verticalLine);

  // 3. 子カードへの接続横線
  tree.children.forEach((child) => {
    const childRect = child.cardEl.getBoundingClientRect();
    const cX = childRect.left - containerRect.left;
    const cY = childRect.top + childRect.height / 2 - containerRect.top;

    const childLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    childLine.setAttribute('x1', String(trunkX));
    childLine.setAttribute('y1', String(cY));
    childLine.setAttribute('x2', String(cX));
    childLine.setAttribute('y2', String(cY));
    childLine.setAttribute('stroke', '#64748b');
    childLine.setAttribute('stroke-width', '2');
    svg.appendChild(childLine);

    drawOrthogonalLines(child, svg, containerRect);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  if (!app) return;

  app.className = 'min-h-screen bg-slate-100 p-10 overflow-auto font-sans';

  const header = document.createElement('h1');
  header.className = 'text-2xl font-bold mb-8 text-slate-800';
  header.textContent = '日本の行政機関 組織図';
  app.appendChild(header);

  const wrapper = document.createElement('div');
  wrapper.className = 'relative inline-block min-w-max p-8';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none z-0');
  wrapper.appendChild(svg);

  const rootTree = createNodeElement(japanGovData);
  const contentContainer = document.createElement('div');
  contentContainer.className = 'relative z-10 inline-block';
  contentContainer.appendChild(rootTree.element);
  wrapper.appendChild(contentContainer);

  app.appendChild(wrapper);

  const renderLines = () => {
    svg.innerHTML = '';
    const wrapperRect = wrapper.getBoundingClientRect();
    svg.setAttribute('width', String(wrapperRect.width));
    svg.setAttribute('height', String(wrapperRect.height));
    drawOrthogonalLines(rootTree, svg, wrapperRect);
  };

  setTimeout(renderLines, 100);

  window.addEventListener('resize', () => {
    setTimeout(renderLines, 50);
  });
});