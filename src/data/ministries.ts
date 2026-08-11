export interface OrgNode {
  name: string;
  role?: string;
  type: 'cabinet' | 'office' | 'ministry' | 'agency';
  children?: OrgNode[];
}

export const japanGovData: OrgNode = {
  name: '内閣',
  role: '内閣総理大臣',
  type: 'cabinet',
  children: [
    {
      name: '内閣府',
      type: 'office',
      children: [
        ({ name: '宮内庁', type: 'agency' } as OrgNode),
        { name: '公正取引委員会', type: 'agency' },
        { name: '国家公安委員会', type: 'agency' },
        { name: 'カジノ管理委員会', type: 'agency' },
        { name: '個人情報保護委員会', type: 'agency' },
        { name: '金融庁', type: 'agency' },
        { name: '消費者庁', type: 'agency' },
        { name: 'こども家庭庁', type: 'agency' },
      ],
    },
    { name: 'デジタル庁', type: 'agency' },
    { name: '復興庁', type: 'agency' },
    { name: '内閣官房', type: 'cabinet' },
    {
      name: '総務省',
      type: 'ministry',
      children: [
        { name: '公害等調整委員会', type: 'agency' },
        { name: '消防庁', type: 'agency' },
      ],
    },
    {
      name: '法務省',
      type: 'ministry',
      children: [
        { name: '出入国在留管理庁', type: 'agency' },
        { name: '公安審査委員会', type: 'agency' },
        { name: '公安調査庁', type: 'agency' },
      ],
    },
    {
      name: '外務省',
      type: 'ministry',
    },
    {
      name: '財務省',
      type: 'ministry',
      children: [
        { name: '国税庁', type: 'agency' },
      ],
    },
    {
      name: '文部科学省',
      type: 'ministry',
      children: [
        { name: 'スポーツ庁', type: 'agency' },
        { name: '文化庁', type: 'agency' },
        { name: 'こども家庭庁', type: 'agency' }, // ※内閣府の外局だが例示用
      ],
    },
    {
      name: '厚生労働省',
      type: 'ministry',
      children: [
        { name: '中央労働委員会', type: 'agency' },
      ],
    },
    {
      name: '農林水産省',
      type: 'ministry',
      children: [
        { name: '林野庁', type: 'agency' },
        { name: '水産庁', type: 'agency' },
      ],
    },
    {
      name: '経済産業省',
      type: 'ministry',
      children: [
        { name: '資源エネルギー庁', type: 'agency' },
        { name: '特許庁', type: 'agency' },
        { name: '中小企業庁', type: 'agency' },
      ],
    },
    {
      name: '国土交通省',
      type: 'ministry',
      children: [
        { name: '観光庁', type: 'agency' },
        { name: '気象庁', type: 'agency' },
        { name: '運輸安全委員会', type: 'agency' },
        { name: '海上保安庁', type: 'agency' },
      ],
    },
    {
      name: '環境省',
      type: 'ministry',
      children: [
        { name: '原子力規制委員会', type: 'agency' },
      ],
    },
    {
      name: '防衛省',
      type: 'ministry',
      children: [
        { name: '防衛装備庁', type: 'agency' },
      ],
    },
    {
      name: '内閣法制局',
      type: 'cabinet',
    },
    {
      name: '人事院',
      type: 'agency',
    },
    {
      name: '〇〇本部等',
      type: 'agency',
    },
  ],
};