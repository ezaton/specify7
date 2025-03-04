/**
 * Localization strings used in the Tree Viewer
 *
 * @module
 */

import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

export const treeText = createDictionary({
  trees: {
    'en-us': 'Trees',
    'ru-ru': 'Деревья',
    'es-es': 'Árboles',
    'fr-fr': 'Arbres',
    'uk-ua': 'Дерева',
    'de-ch': 'Hierarchien',
  },
  badStructure: {
    'en-us': 'Bad tree structure.',
    'ru-ru': 'У дерева плохая структура.',
    'es-es': 'Mala estructura de árbol.',
    'fr-fr': 'Structure hiérarchique incorrecte.',
    'uk-ua': 'Погана структура дерева.',
    'de-ch': 'Fehlerhafte Baumstruktur.',
  },
  move: {
    'en-us': 'Move',
    'ru-ru': 'Переместить',
    'es-es': 'Mover',
    'fr-fr': 'Déplacer',
    'uk-ua': 'Перемістити',
    'de-ch': 'Verschieben',
  },
  merge: {
    'en-us': 'Merge',
    'ru-ru': 'Объединить',
    'es-es': 'Unir',
    'fr-fr': 'Fusionner',
    'uk-ua': 'Об’єднати',
    'de-ch': 'Zusammenführen',
  },
  undoSynonymy: {
    'en-us': 'Undo Synonymy',
    'ru-ru': 'Отменить синонимию',
    'es-es': 'Deshacer sinonimia',
    'fr-fr': 'Annuler la synonymie',
    'uk-ua': 'Скасувати синонімію',
    'de-ch': 'Synonymie rückgängig machen',
  },
  synonymize: {
    'en-us': 'Synonymize',
    'ru-ru': 'Сделать синонимом',
    'es-es': 'Sinonimizar',
    'fr-fr': 'Synonymiser',
    'uk-ua': 'Синонімізувати',
    'de-ch': 'Synonymisieren',
  },
  actionFailed: {
    'en-us': 'Operation failed',
    'ru-ru': 'Операция провалена',
    'es-es': 'Operación fallida',
    'fr-fr': "L'opération a échoué",
    'uk-ua': 'Операція не вдалася',
    'de-ch': 'Vorgang fehlgeschlagen',
  },
  actionFailedDescription: {
    'en-us':
      'The operation could not be completed due to the following errors:',
    'ru-ru': 'Операция не может быть завершена из-за следующих ошибок:',
    'es-es':
      'No se pudo completar la operación debido a los siguientes errores:',
    'fr-fr': `
      L'opération n'a pas pu être effectuée en raison des erreurs suivantes :
    `,
    'uk-ua': 'Операцію не вдалося завершити через такі помилки:',
    'de-ch': `
      Der Vorgang konnte aufgrund der folgenden Fehler nicht ausgeführt werden:
    `,
  },
  moveNode: {
    'en-us': 'Move node',
    'ru-ru': 'Переместить',
    'es-es': 'Mover nodo',
    'fr-fr': 'Déplacer le nœud',
    'uk-ua': 'Перемістити вузол',
    'de-ch': 'Knoten verschieben',
  },
  addChild: {
    'en-us': 'Add Child',
    'ru-ru': 'Добавить Ребенка',
    'es-es': 'Agregar niño',
    'fr-fr': 'Ajouter un enfant',
    'uk-ua': 'Додати дитину',
    'de-ch': 'Kind hinzuzufügen',
  },
  moveNodeHere: {
    'en-us': 'Move "{nodeName:string}" here',
    'ru-ru': 'Переместите «{nodeName:string}» сюда',
    'es-es': 'Mueva "{nodeName:string}" aquí',
    'fr-fr': 'Déplacer « {nodeName:string} » ici',
    'uk-ua': 'Перемістити "{nodeName:string}" сюди.',
    'de-ch': 'Verschiebe "{nodeName:string}" hierhin',
  },
  nodeMoveMessage: {
    'en-us': `
      The {treeName:string} node "{nodeName:string}" will be placed, along with
      all of its descendants, under the new parent "{parentName:string}".
    `,
    'ru-ru': `
      «{nodeName:string}» ({treeName:string}) будет размещен вместе со всеми его
      дочерними элементами, под новым родительским элементом
      {parentName:string}.
    `,
    'es-es': `
      El nodo {treeName:string} "{nodeName:string}" se colocará, junto con todos
      sus descendientes, bajo el nuevo padre "{parentName:string}".
    `,
    'fr-fr': `
      Le nœud {treeName:string} "{nodeName:string}" sera placé, avec tous ses
      descendants, sous le nouveau parent "{parentName:string}".
    `,
    'uk-ua': `
      Вузол {treeName:string} "{nodeName:string}" буде розміщено разом із усіма
      його нащадками під новим батьківським вузлом "{parentName:string}".
    `,
    'de-ch': `
      Der {treeName:string} Knoten "{nodeName:string}" wird zusammen mit allen
      seinen Unterknoten unter den neuen übergeordneten Knoten
      "{parentName:string}" platziert.
    `,
  },
  cantMoveHere: {
    'en-us': "Can't move this tree node here",
    'ru-ru': 'Невозможно переместить этот узел в этот узел',
    'es-es': 'No se puede mover este nodo de árbol aquí',
    'fr-fr': "Impossible de déplacer ce nœud d'arborescence ici",
    'uk-ua': 'Неможливо перемістити цей вузол дерева сюди',
    'de-ch': 'Dieser Knoten kann nicht hierhin verschoben werden',
  },
  cantMergeHere: {
    'en-us': "Can't merge this tree node here",
    'ru-ru': 'Невозможно объединить этот узел в этот узел',
    'es-es': 'No se puede fusionar este nodo de árbol aquí',
    'fr-fr': "Impossible de fusionner ce nœud d'arborescence ici",
    'uk-ua': 'Неможливо об’єднати цей вузол дерева тут',
    'de-ch': 'Dieser Knoten kann hier nicht zusammengelegt werden',
  },
  cantMoveToSynonym: {
    'en-us': "Can't move to a synonym",
    'ru-ru': 'Невозможно переместить в синоним',
    'es-es': 'No se puede mover a un sinónimo',
    'fr-fr': 'Impossible de passer à un synonyme',
    'uk-ua': 'Неможливо перейти до синоніма',
    'de-ch': 'Kann nicht zu einem Synonym verschieben',
  },
  cantMergeIntoSynonym: {
    'en-us': "Can't merge into synonyms",
    'ru-ru': 'Невозможно объединить в синонимы',
    'es-es': 'No se puede fusionar en sinónimos',
    'fr-fr': 'Impossible de fusionner en synonymes',
    'uk-ua': 'Неможливо злити в синоніми',
    'de-ch': 'Kann nicht zu Synonymen zusammenführen',
  },
  cantSynonymizeSynonym: {
    'en-us': "Can't synonymize with a synonym",
    'ru-ru': 'Невозможно сделать синонимом синонима',
    'es-es': 'No se puede sinonimizar con un sinónimo',
    'fr-fr': 'Ne peut pas synonyme avec un synonyme',
    'uk-ua': 'Не можна синонімізувати синонім',
    'de-ch': 'Kann nicht mit einem Synonym synonymisiert werden',
  },
  nodeMoveHintMessage: {
    'en-us': 'Select a new parent for "{nodeName:string}"',
    'ru-ru': 'Выберите нового родителя для «{nodeName:string}»',
    'es-es': 'Seleccione un nuevo padre para "{nodeName:string}"',
    'fr-fr': 'Sélectionnez un nouveau parent pour « {nodeName:string} »',
    'uk-ua': 'Виберіть новий батьківський елемент для "{nodeName:string}"',
    'de-ch': 'Wählen Sie ein neues Elternelement für "{nodeName:string}"',
  },
  mergeNode: {
    'en-us': 'Merge node',
    'ru-ru': 'Объединить',
    'es-es': 'Combinar nodo',
    'fr-fr': 'Fusionner le nœud',
    'uk-ua': 'Вузол злиття',
    'de-ch': 'Knoten zusammenführen',
  },
  mergeNodeHere: {
    'en-us': 'Merge "{nodeName:string}" here',
    'ru-ru': 'Объедините «{nodeName:string}» здесь',
    'es-es': 'Combinar "{nodeName:string}" aquí',
    'fr-fr': 'Fusionner « {nodeName:string} » ici',
    'uk-ua': 'Об\'єднайте "{nodeName:string}" тут',
    'de-ch': 'Führe "{nodeName:string}" hier zusammen',
  },
  mergeNodeHintMessage: {
    'en-us': 'Select a new target for "{nodeName:string}" to be merged into',
    'ru-ru': 'Выберите новый пункт назначения для слияния «{nodeName:string}»',
    'es-es':
      'Seleccione un nuevo destino para que "{nodeName:string}" se fusione',
    'fr-fr': `
      Sélectionnez une nouvelle cible pour "{nodeName:string}" à fusionner dans
    `,
    'uk-ua':
      'Виберіть нову ціль для «{nodeName:string}», у яку потрібно об’єднати',
    'de-ch': 'Wähle ein neues Ziel um "{nodeName:string}" zusammenzuführen',
  },
  mergeNodeMessage: {
    'en-us': `
      All references to {treeName:string} node "{nodeName:string}" will be
      replaced with "{parentName:string}", and all descendants of
      "{nodeName:string}" will be moved to "{parentName:string}" with any
      descendants matching in name and rank being themselves merged recursively.
    `,
    'ru-ru': `
      Все ссылки на "{nodeName:string}" ({treeName:string}) будут заменены с
      "{parentName:string}", и все потомки "{nodeName:string}" будет перемещен
      в "{parentName:string}" с соответствующими потомками по названию и рангу
      подвергнется рекурсивному слиянию.
    `,
    'es-es': `
      Todas las referencias al nodo {treeName:string} "{nodeName:string}" se
      reemplazarán con "{parentName:string}", y todos los descendientes de
      "{nodeName:string}" se moverán a "{parentName:string}" y los
      descendientes que coincidan en nombre y rango serán ellos mismos combinado
      recursivamente.
    `,
    'fr-fr': `
      Toutes les références au nœud {treeName:string} "{nodeName:string}" seront
      remplacées par "{parentName:string}", et tous les descendants de
      "{nodeName:string}" seront déplacés vers "{parentName:string}", tous les
      descendants correspondant au nom et au rang étant eux-mêmes fusionné
      récursivement.
    `,
    'uk-ua': `
      Усі посилання на вузол {treeName:string} «{nodeName:string}» буде замінено
      на «{parentName:string}», а всі нащадки «{nodeName:string}» буде
      переміщено до «{parentName:string}», а будь-які нащадки, що відповідають
      імені та рангу, будуть самі собою об'єднані рекурсивно.
    `,
    'de-ch': `
      Alle Referenzen zu {treeName:string} "{nodeName:string}" werden mit
      "{parentName:string}" ersetzt. Alle Nachkommen von "{nodeName:string}"
      werden nach "{parentName:string}" verschoben, wobei alle Nachkommen, die
      in Name und Rang übereinstimmen, selbst rekursiv zusammengeführt werden.
    `,
  },
  synonymizeNode: {
    'en-us': 'Synonymize node',
    'ru-ru': 'Синонимизировать',
    'es-es': 'Sinonimizar nodo',
    'fr-fr': 'Synonymiser le nœud',
    'uk-ua': 'Синонімізувати вузол',
    'de-ch': 'Knoten synonymisieren',
  },
  makeSynonym: {
    'en-us': 'Make {nodeName:string} a synonym of {synonymName:string}',
    'ru-ru': 'Сделайте {nodeName:string} синонимом {synonymName:string}',
    'es-es': 'Hacer {nodeName:string} un sinónimo de {synonymName:string}',
    'fr-fr': 'Faire de {nodeName:string} un synonyme de {synonymName:string}',
    'uk-ua': 'Зробити {nodeName:string} синонімом {synonymName:string}',
    'de-ch':
      'Aus {nodeName:string} ein Synonym von {synonymName:string} machen',
  },
  synonymizeNodeHintMessage: {
    'en-us': 'Select a target for "{nodeName:string}" to be synonymized to',
    'ru-ru': 'Выберите цель, синонимом которой будет «{nodeName:string}»',
    'es-es':
      'Seleccione un objetivo para "{nodeName:string}" para ser sinónimo',
    'fr-fr': 'Sélectionnez une cible pour "{nodeName:string}" à synonyme de',
    'uk-ua': 'Виберіть ціль для "{nodeName:string}", який буде синонімічним',
    'de-ch': 'Wähle Ziel um "{nodeName:string}" daran zu synonymisieren',
  },
  synonymizeMessage: {
    'en-us': `
      The {treeName:string} node "{nodeName:string}" will be made a synonym of
      "{synonymName:string}".
    `,
    'ru-ru': `
      Узел «{nodeName:string}» ({treeName:string}) станет синонимом
      «{synonymName:string}».
    `,
    'es-es': `
      El nodo {treeName:string} "{nodeName:string}" se convertirá en sinónimo de
      "{synonymName:string}".
    `,
    'fr-fr': `
      Le nœud {treeName:string} "{nodeName:string}" deviendra un synonyme de
      "{synonymName:string}".
    `,
    'uk-ua': `
      Вузол {treeName:string} "{nodeName:string}" стане синонімом
      "{synonymName:string}".
    `,
    'de-ch': `
      Der {treeName:string}-Knoten "{nodeName:string}" wird zu einem Synonym von
      "{synonymName:string}".
    `,
  },
  desynonymizeNode: {
    'en-us': 'Desynonymize node',
    'ru-ru': 'Отменить синонимизацию',
    'es-es': 'Desinonimizar nodo',
    'fr-fr': 'Désynonymiser le nœud',
    'uk-ua': 'Десинонімізувати вузол',
    'de-ch': 'Knoten desynonymisieren',
  },
  desynonymizeNodeMessage: {
    'en-us': `
      "{nodeName:string}" will no longer be a synonym of "{synonymName:string}".
    `,
    'ru-ru':
      '«{nodeName:string}» больше не будет синонимом «{synonymName:string}».',
    'es-es':
      '"{nodeName:string}" ya no será sinónimo de "{synonymName:string}".',
    'fr-fr':
      '"{nodeName:string}" ne sera plus synonyme de "{synonymName:string}".',
    'uk-ua':
      '"{nodeName:string}" більше не буде синонімом "{synonymName:string}".',
    'de-ch': `
      "{nodeName:string}" wird nicht mehr ein Synonym von
      "{synonymName:string}" sein.
    `,
  },
  acceptedName: {
    'en-us': 'Preferred: {name:string}',
    'ru-ru': 'Предпочтительний: {name:string}',
    'es-es': 'Preferido: {name:string}',
    'fr-fr': 'Préféré : {name:string}',
    'uk-ua': 'Бажано: {name:string}',
    'de-ch': 'Bevorzugt: {name:string}',
  },
  treeViewTitle: {
    'en-us': '{treeName:string} Tree',
    'ru-ru': '{treeName:string} Дерево',
    'es-es': '{treeName:string} Árbol',
    'fr-fr': 'Arbre {treeName:string}',
    'uk-ua': '{treeName:string} Дерево',
    'de-ch': '{treeName:string} Baum',
  },
  searchTreePlaceholder: {
    'en-us': 'Search Tree',
    'ru-ru': 'Поиск',
    'es-es': 'Árbol de búsqueda',
    'fr-fr': "Rechercher dans l'arbre",
    'uk-ua': 'Дерево пошуку',
    'de-ch': 'Baum durchsuchen',
  },
  opened: {
    'en-us': 'Opened',
    'ru-ru': 'Открыт',
    'es-es': 'Abrió',
    'fr-fr': 'Ouvert',
    'uk-ua': 'Відкрито',
    'de-ch': 'Geöffnet',
  },
  closed: {
    'en-us': 'Closed',
    'ru-ru': 'Закрыт',
    'es-es': 'Cerrado',
    'fr-fr': 'Fermé',
    'uk-ua': 'ЗАЧИНЕНО',
    'de-ch': 'Geschlossen',
  },
  leafNode: {
    'en-us': 'Leaf Node',
    'ru-ru': 'Угловой узел',
    'es-es': 'Nodo hoja',
    'fr-fr': 'Noeud feuille',
    'uk-ua': 'Листковий вузол',
    'de-ch': 'Blattknoten',
  },
  nodeStats: {
    comment: "Used to show tree node's direct and indirect usages",
    'en-us': '({directCount:number|formatted}, {childCount:number|formatted})',
    'ru-ru': '({directCount:number|formatted}, {childCount:number|formatted})',
    'es-es': '({directCount:number|formatted}, {childCount:number|formatted})',
    'fr-fr': '({directCount:number|formatted}, {childCount:number|formatted})',
    'uk-ua': '({directCount:number|formatted}, {childCount:number|formatted})',
    'de-ch': '({directCount:number|formatted}, {childCount:number|formatted})',
  },
  leafNodeStats: {
    comment: "Used to show leaf tree node's direct usages",
    'en-us': '({directCount:number|formatted})',
    'ru-ru': '({directCount:number|formatted})',
    'es-es': '({directCount:number|formatted})',
    'fr-fr': '({directCount:number|formatted})',
    'uk-ua': '({directCount:number|formatted})',
    'de-ch': '({directCount:number|formatted})',
  },
  directCollectionObjectCount: {
    comment: 'Example: Direct Collection Object count',
    'en-us': 'Direct {collectionObjectTable:string} Count',
    'ru-ru': 'Количество прямых {collectionObjectTable:string}',
    'es-es': 'Recuento directo {collectionObjectTable:string}',
    'fr-fr': 'Comptage direct {collectionObjectTable:string}',
    'uk-ua': 'Прямий підрахунок {collectionObjectTable:string}.',
    'de-ch': 'Direkte {collectionObjectTable:string} Anzahl',
  },
  indirectCollectionObjectCount: {
    comment: 'Example: Indirect Collection Object count',
    'en-us': 'Indirect {collectionObjectTable:string} Count',
    'ru-ru': 'Количество непрямых {collectionObjectTable:string}',
    'es-es': 'Recuento indirecto {collectionObjectTable:string}',
    'fr-fr': 'Comptage {collectionObjectTable:string} indirect',
    'uk-ua': 'Непрямий підрахунок {collectionObjectTable:string}.',
    'de-ch': 'Indirekte {collectionObjectTable:string} Anzahl',
  },
  editRanks: {
    'en-us': 'Edit Ranks',
    'ru-ru': 'Изменить ранги',
    'es-es': 'Editar rangos',
    'fr-fr': 'Modifier les rangs',
    'uk-ua': 'Редагувати ранги',
    'de-ch': 'Positionen bearbeiten',
  },
  resourceToDelete: {
    'en-us': 'This will permanently delete the following resource',
    'es-es': 'Esto eliminará permanentemente el siguiente recurso',
    'fr-fr': 'Cela supprimera définitivement la ressource suivante',
    'ru-ru': 'Это навсегда удалит следующий ресурс',
    'uk-ua': 'Це призведе до остаточного видалення наступного ресурсу',
    'de-ch': 'Dadurch wird die folgende Ressource dauerhaft gelöscht',
  },
} as const);
