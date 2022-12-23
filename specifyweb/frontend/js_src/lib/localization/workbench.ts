/**
 * Localization strings used by the WorkBench (and WbPlanView)
 *
 * @module
 */

import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

export const wbText = createDictionary({
  rollback: {
    'en-us': 'Roll Back',
    'ru-ru': 'Откат',
  },
  validate: {
    'en-us': 'Validate',
    'ru-ru': 'Проверить',
  },
  validation: {
    'en-us': 'Validation',
    'ru-ru': 'Проверка',
  },
  upload: {
    'en-us': 'Upload',
    'ru-ru': 'Загрузка',
  },
  rollingBack: {
    'en-us': 'Rolling Back',
    'ru-ru': 'Откат',
  },
  uploading: {
    'en-us': 'Uploading',
    'ru-ru': 'Загрузка',
  },
  validating: {
    'en-us': 'Validating',
    'ru-ru': 'Проверка',
  },
  disambiguate: {
    'en-us': 'Disambiguate',
    'ru-ru': 'Устранить Неоднозначность',
  },
  fillDown: {
    'en-us': 'Fill Down',
    'ru-ru': 'Заполнить Вниз',
  },
  fillUp: {
    'en-us': 'Fill Up',
    'ru-ru': 'Заполнить Вверх',
  },
  revert: {
    'en-us': 'Revert',
    'ru-ru': 'Вернуть',
  },
  dataMapper: {
    'en-us': 'Data Mapper',
    'ru-ru': 'Сопоставления',
  },
  dataCheck: {
    'en-us': 'Data Check',
    'ru-ru': 'Проверка данных',
  },
  dataCheckOn: {
    'en-us': 'Data Check: On',
    'ru-ru': 'Проверка данных: вкл.',
  },
  changeOwner: {
    'en-us': 'Change Owner',
    'ru-ru': 'Сменить владельца',
  },
  convertCoordinates: {
    'en-us': 'Convert Coordinates',
    'ru-ru': 'Преобразовать координаты',
  },
  navigation: {
    'en-us': 'Navigation',
    'ru-ru': 'Навигация',
  },
  replace: {
    'en-us': 'Replace',
    'ru-ru': 'Заменять',
  },
  replacementValue: {
    'en-us': 'Replacement value',
    'ru-ru': 'Замена',
  },
  searchResults: {
    'en-us': 'Search Results',
    'ru-ru': 'Результаты Поиска',
  },
  clickToToggle: {
    'en-us': 'Click to toggle visibility',
    'ru-ru': 'Нажмите, чтобы переключить видимость',
  },
  configureSearchReplace: {
    'en-us': 'Configure Search & Replace',
    'ru-ru': 'Настроить поиск и замену',
  },
  modifiedCells: {
    'en-us': 'Modified Cells',
    'ru-ru': 'Модифицированные клетки',
  },
  newCells: {
    'en-us': 'New Cells',
    'ru-ru': 'Новые клетки',
  },
  errorCells: {
    'en-us': 'Error Cells',
    'ru-ru': 'Ячейки с ошибками',
  },
  dataEditor: {
    'en-us': 'Data Editor',
    'ru-ru': 'Редактор данных',
  },
  noUploadPlan: {
    'en-us': 'No Upload Plan is Defined',
    'ru-ru': 'План загрузки не определен',
  },
  noUploadPlanDescription: {
    'en-us':
      'No Upload Plan has been defined for this Data Set. Create one now?',
    'ru-ru': `
      Для этого набора данных не определен план загрузки. Создать эго сейчас?
    `,
  },
  noDisambiguationResults: {
    'en-us': 'Unable to disambiguate',
    'ru-ru': 'Невозможно устранить неуверенность',
  },
  noDisambiguationResultsDescription: {
    'en-us': `
      None of the matched records currently exist in the database. This can
      happen if all of the matching records were deleted since the validation
      process occurred, or if all of the matches were ambiguous with respect
      other records in this data set. In the latter case, you will need to add
      fields and values to the data set to resolve the ambiguity.
    `,
    'ru-ru': `
      Ни одна из совпадающих записей в настоящее время не существует в базе
      данных. Это может произойти, если все совпадающие записи были удалены с
      моментапроверки, или если все совпадения были неоднозначными по отношению
      к другим записям в этом наборе данных. В последнем случае вы потребуется
      добавить новые поля и значения в набор данных, чтобы разрешить
      двусмысленность.
    `,
  },
  disambiguateMatches: {
    'en-us': 'Disambiguate Multiple Record Matches',
    'ru-ru': 'Устранение неоднозначности',
  },
  applyAllUnavailable: {
    'en-us': '"Apply All" is not available while Data Check is in progress.',
    'ru-ru': '«Применить все» недоступно, пока выполняется проверка данных.',
  },
  beginRollback: {
    'en-us': 'Begin Data Set Roll Back?',
    'ru-ru': 'Начать откат набора данных?',
  },
  beginRollbackDescription: {
    'en-us': `
      Rolling back will remove the new data records this Data Set added to the
      Specify database. The entire rollback will be cancelled if any of the
      uploaded data have been referenced (re-used) by other data records since
      they were uploaded.
    `,
    'ru-ru': `
      Откат удалит новые записи данных, которые этот набор данных добавил в базу
      данных Specify. Весь откат будет отменен, если на загруженные данные
      ссылаются другие записи данных с момента они были загружены.
    `,
  },
  startUpload: {
    'en-us': 'Begin Data Set Upload?',
    'ru-ru': 'Начать загрузку набора данных?',
  },
  startUploadDescription: {
    'en-us':
      'Uploading the Data Set will add the data to the Specify database.',
    'ru-ru': 'Загрузка набора данных добавит данные в базу данных Specify.',
  },
  deleteDataSet: {
    'en-us': 'Delete this Data Set?',
    'ru-ru': 'Удалить этот набор данных?',
  },
  deleteDataSetDescription: {
    'en-us': `
      Deleting a Data Set permanently removes it and its Upload Plan. Data
      mappings will no longer be available for re-use with other Data Sets. Also
      after deleting, Rollback will no longer be an option for an uploaded Data
      Set.
    `,
    'ru-ru': `
      Удаление набора данных приводит к безвозвратному удалению его и его плана
      загрузки. План загрузки не будут доступным для повторного использования;
      Отката не будет возможным для загруженного набора данных.
    `,
  },
  dataSetDeleted: {
    'en-us': 'Data Set successfully deleted',
    'ru-ru': 'Набор данных успешно удален',
  },
  dataSetDeletedDescription: {
    'en-us': 'Data Set successfully deleted.',
    'ru-ru': 'Набор данных успешно удален.',
  },
  revertChanges: {
    'en-us': 'Revert Unsaved Changes?',
    'ru-ru': 'Отменить несохраненные изменения?',
  },
  revertChangesDescription: {
    'en-us': `
      This action will discard all changes made to the Data Set since the last
      Save.
    `,
    'ru-ru': `
      Это действие приведет к отмене всех изменений, внесенных в набор данных с
      момента последнего сохранение.
    `,
  },
  saving: {
    'en-us': 'Saving...',
    'ru-ru': 'Сохранение...',
  },
  wbUnloadProtect: {
    'en-us': 'Changes to this Data Set have not been Saved.',
    'ru-ru': 'Изменения в этом наборе данных не были сохранены.',
  },
  noMatchErrorMessage: {
    'en-us': 'No matching record for must-match table.',
    'ru-ru':
      'Нет соответствующей записи для таблицы обязательного соответствия.',
  },
  matchedMultipleErrorMessage: {
    'en-us': `
      This value matches two or more existing database records and the match
      must be disambiguated before uploading.
    `,
    'ru-ru': `
      Это значение соответствует двум или более существующим записям базы данных
      и совпадению
    `,
  },
  validationNoErrors: {
    'en-us': 'Validate Completed with No Errors',
    'ru-ru': 'Проверка завершена без ошибок',
  },
  validationNoErrorsDescription: {
    'en-us': `
      Validation found no errors, it is ready to be uploaded into the database.
    `,
    'ru-ru': `
      Проверка завершена без ошибок. Этот набора данных готов к загрузке в базу
      данных.
    `,
  },
  validationReEditWarning: {
    'en-us': `
      Note: If this Data Set is edited and re-saved, Validate should be re-run
      prior to Uploading to verify that no errors have been introduced.
    `,
    'ru-ru': `
      Примечание: Если этот набор данных отредактирован и повторно сохранен,
      начать проверку снова, чтобы убедиться, что ошибок не было введено.
    `,
  },
  validationErrors: {
    'en-us': 'Validate Completed with Errors',
    'ru-ru': 'Проверка завершена с ошибками',
  },
  validationErrorsDescription: {
    'en-us': 'Validation found errors in the Data Set.',
    'ru-ru': 'Проверка обнаружила ошибки в наборе данных.',
  },
  uploadSuccessful: {
    'en-us': 'Upload Completed with No Errors',
    'ru-ru': 'Загрузка завершена без ошибок',
  },
  uploadSuccessfulDescription: {
    'en-us': `
      Click on the "Results" button to see the number of new records added to
      each database table.
    `,
    'ru-ru': `
      Нажмите кнопку «Результаты», чтобы увидеть количество новых записей
      добавлен в каждую таблицу базы данных
    `,
  },
  uploadErrors: {
    'en-us': 'Upload Failed due to Error Cells',
    'ru-ru': 'Ошибка загрузки из-за ошибок',
  },
  uploadErrorsDescription: {
    'en-us': 'The upload failed due to one or more cell value errors.',
    'ru-ru':
      'Загрузка не удалась из-за одной или нескольких ошибок значений ячеек.',
  },
  uploadErrorsSecondDescription: {
    'en-us': `
      Validate the Data Set and review the mouseover hints for each error cell,
      then make the appropriate corrections. Save and retry the Upload.
    `,
    'ru-ru': `
      Проверте набор данных и наведите указатель мыши на каждую ячейку с
      ошибкой, затем сделайте соответствующие исправления, сохраните и повторите
      попытку.
    `,
  },
  dataSetRollback: {
    'en-us': 'Data Set was rolled back successfully',
    'ru-ru': 'Набор данных был успешно откат',
  },
  dataSetRollbackDescription: {
    'en-us':
      'This Rolledback Data Set is saved, and can be edited or re-uploaded.',
    'ru-ru': `
      Этот набор данных отката сохранянен, и его можно редактировать или
      повторно загружать.
    `,
  },
  validationCanceled: {
    'en-us': 'Validation Canceled',
    'ru-ru': 'Проверка отменена',
  },
  validationCanceledDescription: {
    'en-us': 'Data Set Validation cancelled.',
    'ru-ru': 'Проверка набора данных отменена.',
  },
  rollbackCanceled: {
    'en-us': 'Rollback Canceled',
    'ru-ru': 'Откат отменен',
  },
  rollbackCanceledDescription: {
    'en-us': 'Data Set Rollback cancelled.',
    'ru-ru': 'Откат набора данных отменен.',
  },
  uploadCanceled: {
    'en-us': 'Upload Canceled',
    'ru-ru': 'Загрузка отменена',
  },
  uploadCanceledDescription: {
    'en-us': 'Data Set Upload cancelled.',
    'ru-ru': 'Загрузка набора данных отменена.',
  },
  coordinateConverter: {
    'en-us': 'Geocoordinate Format',
    'ru-ru': 'Геокоординатный формат',
  },
  coordinateConverterDescription: {
    'en-us': 'Choose a preferred Geocoordinate format',
    'ru-ru': 'Выберите предпочтительный формат геокоординат',
  },
  unmappedColumn: {
    'en-us': 'Unmapped Column',
    'ru-ru': 'Несопоставленный столбец',
  },
  notMapped: {
    'en-us': 'NOT MAPPED',
    'ru-ru': 'НЕСОПОСТАВЛЕННЫЙ',
  },
  emptyStringInline: {
    'en-us': '(empty string)',
    'ru-ru': '(пуста строка)',
  },
  wbUploadedUnavailable: {
    'en-us': 'The data set must be validated or uploaded',
    'ru-ru': 'The data set must be validated or uploaded',
  },
  wbValidateUnavailable: {
    'en-us':
      'An Upload Plan needs to defined before this Data Set can be Validated',
    'ru-ru': `
      План загрузки должен быть определен до того, как этот набор данных может
      быть проверен
    `,
  },
  unavailableWhileEditing: {
    'en-us': 'This action requires all changes to be saved',
    'ru-ru': 'Это действие требует сохранения всех изменений',
  },
  uploadUnavailableWhileHasErrors: {
    'en-us': 'Upload is unavailable while some cells have validation errors',
    'ru-ru': `
      Загрузка недоступна, в то время как в некоторых ячейках есть ошибки
      проверки
    `,
  },
  unavailableWhileViewingResults: {
    'en-us': 'This action is unavailable while viewing the upload results',
    'ru-ru': 'Это действие недоступно при просмотре результатов загрузки',
  },
  unavailableWhileValidating: {
    'en-us': 'This action is unavailable while Data Check is in progress',
    'ru-ru': 'Это действие недоступно, пока выполняется проверка данных',
  },
  unavailableWithoutLocality: {
    'en-us': 'This tool requires locality columns to be mapped',
    'ru-ru':
      'Этот инструмент требует, чтобы столбцы координат были сопоставлены',
  },
  unavailableWhenUploaded: {
    'en-us': 'This tool does not work with uploaded Data Sets',
    'ru-ru': 'Этот инструмент не работает с загруженными наборами данных',
  },
  dataSetDeletedOrNotFound: {
    'en-us': 'Data Set was deleted by another session.',
    'ru-ru': 'Набор данных был удален другим сеансом.',
  },
  includeDmsSymbols: {
    'en-us': 'Include DMS Symbols',
    'ru-ru': 'Включить символы DMS',
  },
  uploadResults: {
    'en-us': 'Upload Results',
    'ru-ru': 'Результаты загрузки',
  },
  potentialUploadResults: {
    'en-us': 'Potential Upload Results',
    'ru-ru': 'Возможные результаты загрузки',
  },
  noUploadResultsAvailable: {
    'en-us': 'No upload results are available for this cell',
    'ru-ru': 'Для этой ячейки нет результатов загрузки',
  },
  wbUploadedDescription: {
    'en-us': 'Number of new records created in each table:',
    'ru-ru': 'Количество новых записей, созданных в каждой таблице:',
  },
  wbUploadedPotentialDescription: {
    'en-us': 'Number of new records that would be created in each table:',
    'ru-ru':
      'Количество новых записей, которые будут созданы в каждой таблице:',
  },
  navigationOptions: {
    'en-us': 'Navigation Options',
    'ru-ru': 'Опции навигации',
  },
  cursorPriority: {
    'en-us': 'Cursor Priority',
    'ru-ru': 'Приоритет курсора',
  },
  columnFirst: {
    'en-us': 'Column first',
    'ru-ru': 'Столбец за столбцом',
  },
  rowFirst: {
    'en-us': 'Row first',
    'ru-ru': 'Ряд за рядом',
  },
  searchOptions: {
    'en-us': 'Search Options',
    'ru-ru': 'Параметры поиска',
  },
  findEntireCellsOnly: {
    'en-us': 'Find entire cells only',
    'ru-ru': 'Найти только целые ячейки',
  },
  matchCase: {
    'en-us': 'Match case',
    'ru-ru': 'Учитывать регистр',
  },
  useRegularExpression: {
    'en-us': 'Use regular expression',
    'ru-ru': 'Использовать регулярное выражение',
  },
  liveUpdate: {
    'en-us': 'Live search',
    'ru-ru': 'Живой поиск',
  },
  replaceOptions: {
    'en-us': 'Replace Options',
    'ru-ru': 'Параметры замены',
  },
  replaceMode: {
    'en-us': 'Replace Mode',
    'ru-ru': 'Режим замены',
  },
  replaceAll: {
    'en-us': 'Replace all matches',
    'ru-ru': 'Заменить все совпадения',
  },
  replaceNext: {
    'en-us': 'Replace next occurrence',
    'ru-ru': 'Заменить следующее происшествие',
  },
  importDataSet: {
    'en-us': 'Import Data Set',
    'ru-ru': 'Импортировать набор данных',
  },
  wbImportHeader: {
    'en-us': 'Import a File to Create a New Data Set',
    'ru-ru': 'Импортируйте файл для создания нового набора данных',
  },
  previewDataSet: {
    'en-us': 'Preview Dataset',
    'ru-ru': 'Предварительный просмотр набора данных',
  },
  errorImporting: {
    'en-us': 'The following error(s) occurred while importing the file:',
    'ru-ru': 'При импорте файла произошли следующие ошибки:',
  },
  corruptFile: {
    'en-us': 'The file {fileName:string} is corrupt or contains no data!',
    'ru-ru': 'Файл {fileName:string} поврежден или не содержит данных!',
  },
  characterEncoding: {
    'en-us': 'Character encoding:',
    'ru-ru': 'Кодировка символов:',
  },
  delimiter: {
    'en-us': 'Delimiter:',
    'ru-ru': 'Разделитель:',
  },
  comma: {
    'en-us': 'Comma',
    'ru-ru': 'Запятая',
  },
  semicolon: {
    'en-us': 'Semicolon',
    'ru-ru': 'Точка с запятой',
  },
  tab: {
    'en-us': 'Tab',
    'ru-ru': 'Табуляция',
  },
  space: {
    'en-us': 'Space',
    'ru-ru': 'Пробел',
  },
  pipe: {
    'en-us': 'Pipe',
    'ru-ru': 'Вертикальная черта',
  },
  determineAutomatically: {
    'en-us': 'Determine automatically',
    'ru-ru': 'Определить автоматически',
  },
  chooseDataSetName: {
    'en-us': 'Name for New Data Set:',
    'ru-ru': 'Имя для нового набора данных:',
  },
  firstRowIsHeader: {
    'en-us': 'First Row is Header:',
    'ru-ru': 'Первая строка является заголовок:',
  },
  importFile: {
    'en-us': 'Import file',
    'ru-ru': 'Импортировать файл',
  },
  columnName: {
    'en-us': 'Column {columnIndex:number}',
    'ru-ru': 'Столбец {columnIndex:number}',
  },
  matchBehavior: {
    'en-us': 'Match Behavior:',
    'ru-ru': 'Поведение при совпадении:',
  },
  columnMapping: {
    'en-us': 'Column Mapping',
    'ru-ru': 'Сопоставление столбцов',
  },
  suggestedMappings: {
    'en-us': 'Suggested Mappings:',
    'ru-ru': 'Предлагаемые сопоставления:',
  },
  requiredFields: {
    'en-us': 'Required Fields',
    'ru-ru': 'Обязательные поля',
  },
  optionalFields: {
    'en-us': 'Optional Fields',
    'ru-ru': 'Необязательные поля',
  },
  hiddenFields: {
    'en-us': 'Hidden Fields',
    'ru-ru': 'Скрытые поля',
  },
  revealHiddenFormFields: {
    'en-us': 'Reveal Hidden Form Fields',
    'ru-ru': 'Показать скрытые поля формы',
  },
  mappingOptions: {
    'en-us': 'Mapping Options',
    'ru-ru': 'Параметры сопоставления',
  },
  ignoreWhenBlank: {
    'en-us': 'Ignore when Blank',
    'ru-ru': 'Игнорировать, когда пусто',
  },
  ignoreWhenBlankDescription: {
    'en-us': `
      When set to "Ignore when Blank" blank values in this column will not be
      considered for matching purposes. Blank values are ignored when matching
      even if a default value is provided
    `,
    'ru-ru': `
      Если задано значение «Игнорировать, когда пусто», пустые значения в этом
      столбце не будет рассматривается для целей сопоставления. Пустые значения
      игнорируются при сопоставлении даже если указано значение по умолчанию
    `,
  },
  ignoreAlways: {
    'en-us': 'Always Ignore',
    'ru-ru': 'Всегда игнорировать',
  },
  ignoreAlwaysDescription: {
    'en-us': `
      When set to "Ignore Always" the value in this column will never be
      considered for matching purposes, only for uploading.
    `,
    'ru-ru': `
      Если задано значение «Всегда игнорировать», значение в этом столбце
      никогда не будет рассматривается для целей сопоставления, только для
      загрузки
    `,
  },
  ignoreNever: {
    'en-us': 'Never Ignore',
    'ru-ru': 'Никогда не игнорировать',
  },
  ignoreNeverDescription: {
    'en-us': `
      This column would always be considered for matching purposes, regardless
      of it's value
    `,
    'ru-ru': `
      Этот столбец всегда будет учитываться для целей сопоставления, независимо
      от содержимое столбца
    `,
  },
  allowNullValues: {
    'en-us': 'Allow Null Values',
    'ru-ru': 'Разрешить нулевые значения',
  },
  useDefaultValue: {
    'en-us': 'Use Default Value',
    'ru-ru': 'Использовать значение по умолчанию',
  },
  defaultValue: {
    'en-us': 'Default Value',
    'ru-ru': 'Значение по умолчанию',
  },
  useDefaultValueDescription: {
    'en-us': 'This value would be used in place of empty cells',
    'ru-ru': 'Это значение будет использоваться вместо пустых ячеек',
  },
  addNewColumn: {
    'en-us': 'Add New Column',
    'ru-ru': 'Добавить новую колонку',
  },
  validationFailed: {
    'en-us': 'Validation found missing mappings:',
    'ru-ru': 'Проверка обнаружила недостающие сопоставления:',
  },
  validationFailedDescription: {
    'en-us': `
      This data mapping is missing one or more data fields required for
      uploading by your Specify configuration. Add the missing mappings shown or
      save this Upload Plan as unfinished.
    `,
    'ru-ru': `
      В этом сопоставлении данные отсутствует в одном или нескольких полей
      данных, необходимых для загрузки по вашей Specify конфигурацию. Добавьте
      недостающие сопоставления или сохраните этот план загрузки как
      незавершенный.
    `,
  },
  continueEditing: {
    'en-us': 'Continue Editing',
    'ru-ru': 'Продолжить редактирование',
  },
  saveUnfinished: {
    'en-us': 'Save Unfinished',
    'ru-ru': 'Сохранить незаконченное',
  },
  map: {
    'en-us': 'Map',
    'ru-ru': 'Сопоставить',
  },
  unmap: {
    'en-us': 'Unmap',
    'ru-ru': 'Отменить сопоставления',
  },
  mapButtonDescription: {
    'en-us': 'Map selected field to selected header',
    'ru-ru': 'Сопоставить выбранное поле с выбранным столбцом',
  },
  relationshipWithTable: {
    'en-us': 'Relationship with the {tableName:string} table',
    'ru-ru': 'Связь с таблицей {tableName:string}',
  },
  selectBaseTable: {
    'en-us': 'Select a Base Table',
    'ru-ru': 'Выберите базовую таблицу',
  },
  chooseExistingPlan: {
    'en-us': 'Choose Existing Plan',
    'ru-ru': 'Выберите существующий план',
  },
  showAdvancedTables: {
    'en-us': 'Show Advanced Tables',
    'ru-ru': 'Показать дополнительные таблицы',
  },
  dataSetUploaded: {
    'en-us': 'Data Set uploaded. This Upload Plan cannot be changed',
    'ru-ru': 'Набор данных загружен. Этот план загрузки нельзя изменить',
  },
  dataSetUploadedDescription: {
    'en-us': `
      You are viewing the mappings for an uploaded dataset.
      
      To edit the mappings, rollback the uploaded data or create a new dataset
    `,
    'ru-ru': `
      Вы просматриваете сопоставления для загруженного набора данных.
      
      Чтобы изменить сопоставления, откатите загруженные данные или создайте
      новый набор данных
    `,
  },
  baseTable: {
    'en-us': 'Base Table',
    'ru-ru': 'Базовая таблица',
  },
  goToBaseTable: {
    'en-us': 'Change the Base Table for Mapping Data Set Columns?',
    'ru-ru':
      'Изменить базовую таблицу для сопоставления столбцов набора данных?',
  },
  goToBaseTableDescription: {
    'en-us': `
      Choosing a different Base Table for a Data Set Upload will make that table
      the new starting point for column-to-data field mappings and will erase
      existing mappings. The AutoMapper will attempt to map columns to the new
      Base Table fields.
    `,
    'ru-ru': `
      Выбор другой базовой таблице для загрузки набора данных сделает ту таблицу
      новой отправной точкой для сопоставлений полей столбцов и данных и сотрет
      существующие сопоставления. AutoMapper попытается сопоставить столбцы в
      новые поля базовой таблицы.
    `,
  },
  clearMapping: {
    'en-us': 'Clear Mapping',
    'ru-ru': 'Очистить сопоставление',
  },
  reRunAutoMapper: {
    'en-us': 'Rerun AutoMapper',
    'ru-ru': 'Перезапустить AutoMapper',
  },
  autoMapper: {
    'en-us': 'AutoMapper',
    'ru-ru': 'AutoMapper',
  },
  mappingEditor: {
    'en-us': 'Map Explorer',
    'ru-ru': 'Обзор сопоставлений',
  },
  hideFieldMapper: {
    'en-us': 'Hide Field Mapper',
    'ru-ru': 'Спрятать обзор сопоставлений',
  },
  showFieldMapper: {
    'en-us': 'Show Field Mapper',
    'ru-ru': 'Показать обзор сопоставлений',
  },
  mappings: {
    'en-us': 'Mappings',
    'ru-ru': 'Сопоставления',
  },
  clearMappings: {
    'en-us': 'Clear Mappings',
    'ru-ru': 'Очистить сопоставления',
  },
  emptyDataSet: {
    'en-us': 'Empty Data Set',
    'ru-ru': 'Пустой набор данных',
  },
  emptyDataSetDescription: {
    'en-us': "This Data Set doesn't have any columns.",
    'ru-ru': 'В этом наборе данных нет столбцов.',
  },
  emptyDataSetSecondDescription: {
    'en-us': `
      Press the "Add New Column" button below the mapping lines to add new
      columns.
    `,
    'ru-ru': `
      Нажмите кнопку "Добавить новый столбец" под строками сопоставления, чтобы
      добавить новые столбцы.
    `,
  },
  reRunAutoMapperConfirmation: {
    'en-us': 'Automap to start a new Upload Plan?',
    'ru-ru': 'Автоматически сопоставить?',
  },
  reRunAutoMapperConfirmationDescription: {
    'en-us': 'This will erase existing data field mappings.',
    'ru-ru': 'Это сотрет существующие сопоставления.',
  },
  changeMatchingLogic: {
    'en-us': 'Change Matching Logic',
    'ru-ru': 'Изменить логику соответствия',
  },
  matchingLogicDescription: {
    'en-us': 'Require Data to Match Existing Records',
    'ru-ru': 'Требовать сопоставления данных с существующими записями',
  },
  matchingLogicUnavailable: {
    'en-us': 'Matching logic is unavailable for current mappings',
    'ru-ru': 'Логика соответствия недоступна для текущих сопоставлений',
  },
  mustMatch: {
    'en-us': 'Must Match',
    'ru-ru': 'Логика соответствия',
  },
  unloadProtectMessage: {
    'en-us': 'This mapping has not been saved.',
    'ru-ru': 'Это сопоставление не было сохранено.',
  },
  newDataSetName: {
    'en-us': 'New Data Set {date}',
    'ru-ru': 'Новый набор данных {date}',
  },
  newHeaderName: {
    'en-us': 'New Column {index:number}',
    'ru-ru': 'Новый столбец {index:number}',
  },
  noHeader: {
    'en-us': '(no header)',
    'ru-ru': '(нет заголовка)',
  },
  dataSets: {
    'en-us': 'WorkBench Data Sets',
    'ru-ru': 'Наборы данных',
  },
  wbsDialogEmpty: {
    'en-us': 'Currently no Data Sets exist.',
    'ru-ru': 'В настоящее время наборов данных не существует.',
  },
  copyPlan: {
    'en-us': 'Copy plan from existing Data Set',
    'ru-ru': 'Копировать план из существующего набора данных',
  },
  noPlansToCopyFrom: {
    'en-us': `
      There are no plans available, please continue to create an upload plan.
    `,
    'ru-ru': 'Нет доступных планов, продолжайте создавать план загрузки.',
  },
  createDataSetInstructions: {
    'en-us': 'Use "Import a file" or "Create New" to make a new one.',
    'ru-ru': `
      Используйте «Импортировать файл» или «Создать новый», чтобы создать новый.
    `,
  },
  createNew: {
    'en-us': 'Create New',
    'ru-ru': 'Создайте новый',
  },
  dataSetMeta: {
    'en-us': 'Data Set Properties',
    'ru-ru': 'Свойства набора данных',
  },
  dataSetName: {
    'en-us': 'Data Set Name',
    'ru-ru': 'Название набора данных',
  },
  numberOfRows: {
    'en-us': 'Number of rows',
    'ru-ru': 'Количество рядов',
  },
  numberOfColumns: {
    'en-us': 'Number of columns',
    'ru-ru': 'Количество столбцов',
  },
  importedFileName: {
    'en-us': 'Import file name:',
    'ru-ru': 'Имя файла импорта:',
  },
  noFileName: {
    'en-us': '(no file name)',
    'ru-ru': '(файл без имени)',
  },
  changeDataSetOwner: {
    'en-us': 'Change Data Set Owner',
    'ru-ru': 'Изменить владельца набора данных',
  },
  changeDataSetOwnerDescription: {
    'en-us': 'Select New Owner:',
    'ru-ru': 'Выберите нового владельца:',
  },
  dataSetOwnerChanged: {
    'en-us': 'Data Set owner changed',
    'ru-ru': 'Владелец набора данных изменен',
  },
  dataSet: {
    'en-us': 'Data Set:',
    'ru-ru': 'Набор данных:',
  },
  dataSetUploadedLabel: {
    'en-us': '(Uploaded, Read-Only)',
    'ru-ru': '(Загружено, только для чтения)',
  },
  wbStatusUnupload: {
    'en-us': 'Data Set Rollback Status',
    'ru-ru': 'Состояние отката набора данных',
  },
  wbStatusUpload: {
    'en-us': 'Data Set Upload Status',
    'ru-ru': 'Состояние загрузки набора данных',
  },
  wbStatusValidation: {
    'en-us': 'Data Set Validation Status',
    'ru-ru': 'Статус проверки набора данных',
  },
  aborting: {
    'en-us': 'Aborting...',
    'ru-ru': 'Прерывание...',
  },
  wbStatusAbortFailed: {
    'en-us': 'Failed aborting {operationName:string}. Please try again later',
    'ru-ru': `
      Не удалось прервать операцию {operationName:string}. Пожалуйста,
      попробуйте позже
    `,
  },
  wbStatusOperationNoProgress: {
    comment: 'E.x, Validating...',
    'en-us': '{operationName:string}...',
    'ru-ru': '{operationName:string}...',
  },
  wbStatusOperationProgress: {
    comment: 'E.x, Validating row 999/1,000',
    'en-us': `
      {operationName:string} row
      {current:number|formatted}/{total:number|formatted}
    `,
    'ru-ru': `
      {operationName:string} строка
      {current:number|formatted}/{total:number|formatted}
    `,
  },
  wbStatusPendingDescription: {
    'en-us': '{operationName:string} of this Data Set should begin shortly.',
    'ru-ru': `
      {operationName:string} этого набора данных должно начаться в ближайшее
      время.
    `,
  },
  wbStatusPendingSecondDescription: {
    'en-us': `
      If this message persists for longer than 30 seconds, the
      {operationName:string} process is busy with another Data Set. Please try
      again later.
    `,
    'ru-ru': `
      Если это сообщение отображается дольше 30 секунд процесс
      {operationName:string} занят другим набором данных. Пожалуйста, попробуй
      снова позже.
    `,
  },
  wbStatusError: {
    'en-us': 'Error occurred during {operationName:string}',
    'ru-ru': 'Произошла ошибка во время {operationName:string}',
  },
  updatingTrees: {
    'en-us': 'Updating trees...',
    'ru-ru': 'Обновление деревьев...',
  },
  invalidTemplatePlan: {
    'en-us':
      'Selected Data Set has no upload plan. Please select a different one.',
    'ru-ru': `
      Выбранный набор данных не имеет плана загрузки. Выберите другой набор
      данных.
    `,
  },
} as const);
