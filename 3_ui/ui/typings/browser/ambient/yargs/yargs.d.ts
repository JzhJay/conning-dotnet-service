// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/6a287502dab374e7d4cbf18ea1ac5dff7f74726a/yargs/yargs.d.ts
// Type definitions for yargs
// Project: https://github.com/chevex/yargs
// Definitions by: Martin Poelstra <https://github.com/poelstra>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "yargs" {

	module yargs {
		interface Argv {
			argv: any;
			(...args: any[]): any;
			parse(...args: any[]): any;

			reset(): Argv;

			locale(): string;
			locale(loc:string): Argv;
			
			detectLocale(detect:boolean): Argv;

			alias(shortName: string, longName: string): Argv;
			alias(aliases: { [shortName: string]: string }): Argv;
			alias(aliases: { [shortName: string]: string[] }): Argv;

			default(key: string, value: any): Argv;
			default(defaults: { [key: string]: any}): Argv;

			demand(key: string, msg: string): Argv;
			demand(key: string, required?: boolean): Argv;
			demand(keys: string[], msg: string): Argv;
			demand(keys: string[], required?: boolean): Argv;
			demand(positionals: number, required?: boolean): Argv;
			demand(positionals: number, msg: string): Argv;

			require(key: string, msg: string): Argv;
			require(key: string, required: boolean): Argv;
			require(keys: number[], msg: string): Argv;
			require(keys: number[], required: boolean): Argv;
			require(positionals: number, required: boolean): Argv;
			require(positionals: number, msg: string): Argv;

			required(key: string, msg: string): Argv;
			required(key: string, required: boolean): Argv;
			required(keys: number[], msg: string): Argv;
			required(keys: number[], required: boolean): Argv;
			required(positionals: number, required: boolean): Argv;
			required(positionals: number, msg: string): Argv;

			requiresArg(key: string): Argv;
			requiresArg(keys: string[]): Argv;

			describe(key: string, description: string): Argv;
			describe(descriptions: { [key: string]: string }): Argv;

			option(key: string, options: Options): Argv;
			option(options: { [key: string]: Options }): Argv;
			options(key: string, options: Options): Argv;
			options(options: { [key: string]: Options }): Argv;

			usage(message: string, options?: { [key: string]: Options }): Argv;
			usage(options?: { [key: string]: Options }): Argv;

			command(command: string, description: string): Argv;
			command(command: string, description: string, fn: (args: Argv) => void): Argv;

			completion(cmd: string, fn?: SyncCompletionFunction): Argv;
			completion(cmd: string, description?: string, fn?: SyncCompletionFunction): Argv;
			completion(cmd: string, fn?: AsyncCompletionFunction): Argv;
			completion(cmd: string, description?: string, fn?: AsyncCompletionFunction): Argv;

			example(command: string, description: string): Argv;

			check(func: (argv: any, aliases: { [alias: string]: string }) => any): Argv;

			boolean(key: string): Argv;
			boolean(keys: string[]): Argv;

			string(key: string): Argv;
			string(keys: string[]): Argv;

			choices(choices: Object): Argv;
			choices(key: string, values:any[]): Argv;

			config(key: string): Argv;
			config(keys: string[]): Argv;

			wrap(columns: number): Argv;

			strict(): Argv;

			help(): string;
			help(option: string, description?: string): Argv;

			epilog(msg: string): Argv;
			epilogue(msg: string): Argv;

			version(version: string, option?: string, description?: string): Argv;
			version(version: () => string, option?: string, description?: string): Argv;

			showHelpOnFail(enable: boolean, message?: string): Argv;

			showHelp(func?: (message: string) => any): Argv;

			exitProcess(enabled:boolean): Argv;

			/* Undocumented */

			normalize(key: string): Argv;
			normalize(keys: string[]): Argv;

			implies(key: string, value: string): Argv;
			implies(implies: { [key: string]: string }): Argv;

			count(key: string): Argv;
			count(keys: string[]): Argv;

			fail(func: (msg: string) => any): void;
		}

		interface Options {
			type?: string;
			alias?: any;
			demand?: any;
			required?: any;
			require?: any;
			default?: any;
			boolean?: any;
			string?: any;
			count?: any;
			describe?: any;
			description?: any;
			desc?: any;
			requiresArg?: any;
			choices?:string[];
		}

		type SyncCompletionFunction = (current: string, argv: any) => string[];
		type AsyncCompletionFunction = (current: string, argv: any, done: (completion: string[]) => void) => void;
	}

	var yargs: yargs.Argv;
	export = yargs;
}