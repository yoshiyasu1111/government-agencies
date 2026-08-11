import './style.css';
import { japanGovData } from './data/ministries';
import type { OrgNode } from './data/ministries';

// ノードの種類に応じたTailwindのスタイル
function getNodeStyle(type: OrgNode['type']): string {
  switch (type) {
    case 'cabinet':
      return 'bg-red-900 text-white border-red-700 shadow-lg';
    case 'office':
      return 'bg-blue-900 text-white border-blue-700';
    case 'ministry':
      return 'bg-slate-800 text-white border-slate-600';
    case 'agency':
      return 'bg-white text-slate-800 border-slate-300';
    default:
      return 'bg-white text-slate-800 border-slate-300';
  }
}

interface TreeNodeElement {
  element: HTMLElement;
  children: TreeNodeElement[];
  cardEl: HTMLElement;
}

// 組織図のDOMツリーを構築
function createOrgTree(node: OrgNode): TreeNodeElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center mx-3 my-6 relative';

  // カード本体
  const card = document.createElement('div');
  card.className = `px-4 py-3 rounded-lg border-2 text-center min-w-[140px] transition-transform hover:scale-105 cursor-pointer z-10 ${getNodeStyle(node.type)}`;
  
  const title = document.createElement('div');
  title.className = 'font-bold text-sm';
  title.textContent = node.name;
  card.appendChild(title);

  if (node.role) {
    const role = document.createElement('div');
    role.className = 'text-xs opacity-80 mt-1';
    role.textContent = node.role;
    card.appendChild(role);
  }

  card.addEventListener('click', () => {
    alert(`${node.name} が選択されました。`);
  });

  container.appendChild(card);

  const childTreeElements: TreeNodeElement[] = [];

  if (node.children && node.children.length > 0) {
    const childrenWrapper = document.createElement('div');
    childrenWrapper.className = 'flex flex-wrap justify-center items-start pt-8 relative';

    node.children.forEach((child) => {
      const childTree = createOrgTree(child);
      childrenWrapper.appendChild(childTree.element);
      childTreeElements.push(childTree);
    });

    container.appendChild(childrenWrapper);
  }

  return {
    element: container,
    children: childTreeElements,
    cardEl: card,
  };
}

// SVGレイヤーに各ノード間の接続線を描画する関数
function drawLines(
  tree: TreeNodeElement,
  svg: SVGSVGElement,
  containerRect: DOMRect
) {
  if (!tree.children || tree.children.length === 0) return;

  const parentRect = tree.cardEl.getBoundingClientRect();
  const parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
  const parentY = parentRect.bottom - containerRect.top;

  const firstChildRect = tree.children[0].cardEl.getBoundingClientRect();
  const childTopY = firstChildRect.top - containerRect.top;
  const midY = parentY + (childTopY - parentY) / 2;

  // 親から下への縦線
  const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  verticalLine.setAttribute('x1', String(parentX));
  verticalLine.setAttribute('y1', String(parentY));
  verticalLine.setAttribute('x2', String(parentX));
  verticalLine.setAttribute('y2', String(midY));
  verticalLine.setAttribute('stroke', '#94a3b8');
  verticalLine.setAttribute('stroke-width', '2');
  svg.appendChild(verticalLine);

  const firstChildCardRect = tree.children[0].cardEl.getBoundingClientRect();
  const lastChildCardRect = tree.children[tree.children.length - 1].cardEl.getBoundingClientRect();
  
  const firstChildX = firstChildCardRect.left + firstChildCardRect.width / 2 - containerRect.left;
  const lastChildX = lastChildCardRect.left + lastChildCardRect.width / 2 - containerRect.left;

  // 左右を結ぶ水平線
  const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  horizontalLine.setAttribute('x1', String(firstChildX));
  horizontalLine.setAttribute('y1', String(midY));
  horizontalLine.setAttribute('x2', String(lastChildX));
  horizontalLine.setAttribute('y2', String(midY));
  horizontalLine.setAttribute('stroke', '#94a3b8');
  horizontalLine.setAttribute('stroke-width', '2');
  svg.appendChild(horizontalLine);

  // 各子カードへ向かう縦線
  tree.children.forEach((child) => {
    const childRect = child.cardEl.getBoundingClientRect();
    const childX = childRect.left + childRect.width / 2 - containerRect.left;
    const childY = childRect.top - containerRect.top;

    const toChildLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    toChildLine.setAttribute('x1', String(childX));
    toChildLine.setAttribute('y1', String(midY));
    toChildLine.setAttribute('x2', String(childX));
    toChildLine.setAttribute('y2', String(childY));
    toChildLine.setAttribute('stroke', '#94a3b8');
    toChildLine.setAttribute('stroke-width', '2');
    svg.appendChild(toChildLine);

    drawLines(child, svg, containerRect);
  });
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  if (app) {
    app.className = 'min-h-screen bg-slate-100 p-8 overflow-x-auto relative';
    
    const header = document.createElement('h1');
    header.className = 'text-2xl font-bold text-center mb-8 text-slate-800';
    header.textContent = '日本の行政機関 組織図';
    app.appendChild(header);

    const wrapper = document.createElement('div');
    wrapper.className = 'relative flex justify-center min-w-max';

    // SVGレイヤーの作成（className ではなく setAttribute を使用）
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none z-0');
    wrapper.appendChild(svg);

    const rootTree = createOrgTree(japanGovData);
    const contentContainer = document.createElement('div');
    contentContainer.className = 'relative z-10 flex justify-center';
    contentContainer.appendChild(rootTree.element);
    wrapper.appendChild(contentContainer);

    app.appendChild(wrapper);

    // 描画後に正確な座標でSVGの線を引く
    setTimeout(() => {
      svg.innerHTML = '';
      const wrapperRect = wrapper.getBoundingClientRect();
      svg.setAttribute('width', String(wrapperRect.width));
      svg.setAttribute('height', String(wrapperRect.height));
      
      drawLines(rootTree, svg, wrapperRect);
    }, 50);

    window.addEventListener('resize', () => {
      setTimeout(() => {
        svg.innerHTML = '';
        const wrapperRect = wrapper.getBoundingClientRect();
        svg.setAttribute('width', String(wrapperRect.width));
        svg.setAttribute('height', String(wrapperRect.height));
        drawLines(rootTree, svg, wrapperRect);
      }, 50);
    });
  }
});