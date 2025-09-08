// Minimal sample dataset to power the Herbs UI
// This mirrors the model in tasks/03_herbs.md

export type Herb = {
  id: string;
  slug: string;
  nameZh: string;
  namePinyin: string;
  family?: string;
  property?: string;
  flavor?: string[];
  meridians?: string[];
  indications?: string[];
  sourceUrl?: string;
};

export const HERBS: Herb[] = [
  { id: '1', slug: 'astragalus', nameZh: '黄芪', namePinyin: 'Huangqi', family: 'Astragalus membranaceus', property: 'Warm', flavor: ['Sweet'], meridians: ['Lung', 'Spleen'] },
  { id: '2', slug: 'bai-zhu', nameZh: '白术', namePinyin: 'Baizhu', family: 'Atractylodes macrocephala', property: 'Warm', flavor: ['Bitter', 'Sweet'], meridians: ['Spleen', 'Stomach'] },
  { id: '3', slug: 'cang-zhu', nameZh: '苍术', namePinyin: 'Cangzhu', family: 'Atractylodes lancea', property: 'Warm', flavor: ['Acrid', 'Bitter'], meridians: ['Spleen', 'Stomach'] },
  { id: '4', slug: 'dang-gui', nameZh: '当归', namePinyin: 'Danggui', family: 'Angelica sinensis', property: 'Warm', flavor: ['Sweet', 'Acrid'], meridians: ['Liver', 'Heart', 'Spleen'] },
  { id: '5', slug: 'e-jiao', nameZh: '阿胶', namePinyin: 'Ejiao', family: 'Colla Corii Asini', property: 'Neutral', flavor: ['Sweet'], meridians: ['Lung', 'Liver', 'Kidney'] },
  { id: '6', slug: 'fu-ling', nameZh: '茯苓', namePinyin: 'Fuling', family: 'Poria cocos', property: 'Neutral', flavor: ['Sweet', 'Bland'], meridians: ['Heart', 'Spleen', 'Kidney', 'Lung'] },
  { id: '7', slug: 'gan-cao', nameZh: '甘草', namePinyin: 'Gancao', family: 'Glycyrrhiza uralensis', property: 'Neutral', flavor: ['Sweet'], meridians: ['All 12 channels'] },
  { id: '8', slug: 'huo-xiang', nameZh: '藿香', namePinyin: 'Huoxiang', family: 'Pogostemon cablin', property: 'Slightly Warm', flavor: ['Acrid'], meridians: ['Lung', 'Spleen', 'Stomach'] },
  { id: '9', slug: 'jin-yin-hua', nameZh: '金银花', namePinyin: 'Jinyinhua', family: 'Lonicera japonica', property: 'Cold', flavor: ['Sweet'], meridians: ['Lung', 'Heart', 'Stomach'] },
  { id: '10', slug: 'ku-shen', nameZh: '苦参', namePinyin: 'Kushen', family: 'Sophora flavescens', property: 'Cold', flavor: ['Bitter'], meridians: ['Bladder', 'Heart', 'Liver', 'Stomach', 'Large Intestine'] },
  { id: '11', slug: 'long-dan-cao', nameZh: '龙胆草', namePinyin: 'Longdancao', family: 'Gentiana scabra', property: 'Cold', flavor: ['Bitter'], meridians: ['Liver', 'Gallbladder'] },
  { id: '12', slug: 'ma-huang', nameZh: '麻黄', namePinyin: 'Mahuang', family: 'Ephedra sinica', property: 'Warm', flavor: ['Acrid', 'Slightly Bitter'], meridians: ['Lung', 'Bladder'] },
  { id: '13', slug: 'niu-bang-zi', nameZh: '牛蒡子', namePinyin: 'Niubangzi', family: 'Arctium lappa', property: 'Cold', flavor: ['Acrid', 'Bitter'], meridians: ['Lung', 'Stomach'] },
  { id: '14', slug: 'ou-jie', nameZh: '藕节', namePinyin: 'Oujie', family: 'Nelumbo nucifera', property: 'Neutral', flavor: ['Sweet', 'Astringent'], meridians: ['Lung', 'Stomach'] },
  { id: '15', slug: 'pu-gong-ying', nameZh: '蒲公英', namePinyin: 'Pugongying', family: 'Taraxacum mongolicum', property: 'Cold', flavor: ['Bitter', 'Sweet'], meridians: ['Liver', 'Stomach'] },
  { id: '16', slug: 'qiang-huo', nameZh: '羌活', namePinyin: 'Qianghuo', family: 'Notopterygium incisum', property: 'Warm', flavor: ['Acrid', 'Bitter'], meridians: ['Bladder', 'Kidney'] },
  { id: '17', slug: 'ren-shen', nameZh: '人参', namePinyin: 'Renshen', family: 'Panax ginseng', property: 'Slightly Warm', flavor: ['Sweet', 'Slightly Bitter'], meridians: ['Lung', 'Spleen'] },
  { id: '18', slug: 'sheng-jiang', nameZh: '生姜', namePinyin: 'Shengjiang', family: 'Zingiber officinale', property: 'Warm', flavor: ['Acrid'], meridians: ['Lung', 'Spleen', 'Stomach'] },
  { id: '19', slug: 'tai-zi-shen', nameZh: '太子参', namePinyin: 'Taizishen', family: 'Pseudostellaria heterophylla', property: 'Neutral', flavor: ['Sweet'], meridians: ['Lung', 'Spleen'] },
  { id: '20', slug: 'wu-wei-zi', nameZh: '五味子', namePinyin: 'Wuweizi', family: 'Schisandra chinensis', property: 'Warm', flavor: ['Sour', 'Sweet'], meridians: ['Lung', 'Heart', 'Kidney'] },
  { id: '21', slug: 'xi-xin', nameZh: '细辛', namePinyin: 'Xixin', family: 'Asarum sieboldii', property: 'Warm', flavor: ['Acrid'], meridians: ['Heart', 'Lung', 'Kidney'] },
  { id: '22', slug: 'yin-chen', nameZh: '茵陈', namePinyin: 'Yinchen', family: 'Artemisia capillaris', property: 'Slightly Cold', flavor: ['Bitter'], meridians: ['Liver', 'Gallbladder', 'Spleen', 'Stomach'] },
  { id: '23', slug: 'zhi-zi', nameZh: '栀子', namePinyin: 'Zhizi', family: 'Gardenia jasminoides', property: 'Cold', flavor: ['Bitter'], meridians: ['Heart', 'Lung', 'Stomach', 'Liver', 'San Jiao'] },
  // Non-alphabetical example for '#'
  { id: '24', slug: '3h-unique', nameZh: '3号草', namePinyin: '3hao cao', family: 'Sample', property: 'Neutral', flavor: ['Bland'], meridians: ['Spleen'] },
];

