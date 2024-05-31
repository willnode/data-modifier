import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import mdWorker from 'monaco-editor/esm/vs/basic-languages/markdown/markdown?worker';
import sqlWorker from 'monaco-editor/esm/vs/basic-languages/sql/sql?worker';
import yamlWorker from 'monaco-editor/esm/vs/basic-languages/yaml/yaml?worker';
import csvWorker from 'monaco-editor/esm/vs/basic-languages/ini/ini?worker';

// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json' || label === 'json-lines') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'markdown' || label === 'mdt'  || label === 'mdt-object') {
			return new mdWorker();
		}
		if (label === 'csv'  || label === 'csv-object') {
			return new csvWorker();
		}
		if (label === 'sql' || label === 'sql-object') {
			return new sqlWorker();
		}
		if (label === 'yaml' || label == "label-docs") {
			return new yamlWorker();
		}
		if (label === 'typescript' || label === 'javascript' || label === 'json5') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
