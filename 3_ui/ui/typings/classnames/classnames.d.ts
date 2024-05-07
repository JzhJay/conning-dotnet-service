// Type definitions for classnames
// Project: https://github.com/JedWatson/classnames
// Definitions by: Dave Keen <http://www.keendevelopment.ch>, Adi Dahiya <https://github.com/adidahiya>, Jason Killian <https://github.com/JKillian>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

interface ClassDictionary {
	[id: string]: any;
}

interface ClassArray extends Array<ClassValue> { }

type ClassNamesFn = (...classes: ClassValue[]) => string;

declare var classNames: ClassNamesFn;

declare module "classnames" {
	export = classNames
}
