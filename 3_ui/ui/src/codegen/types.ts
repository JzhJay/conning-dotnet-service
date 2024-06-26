export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/** The `Date` scalar type represents a timestamp provided in UTC. `Date` expects
	 * timestamps to be formatted in accordance with the
	 * [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
	 */
	Date: any;
	ObjectId: any;
	Json: any;
	Decimal: any;
};

export type Arrangement = {
	__typename?: "Arrangement";
	columnAxes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	columns?: Maybe<Scalars["Int"]>;
	rowAxes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	rows?: Maybe<Scalars["Int"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type ConningUser = {
	__typename?: "ConningUser";
	_id: Scalars["String"];
	createdAt?: Maybe<Scalars["Date"]>;
	email?: Maybe<Scalars["String"]>;
	emailVerified?: Maybe<Scalars["Boolean"]>;
	fullName?: Maybe<Scalars["String"]>;
	lastLogin?: Maybe<Scalars["Date"]>;
	phoneNumber?: Maybe<Scalars["String"]>;
	phoneVerified?: Maybe<Scalars["Boolean"]>;
};

export type BillingAdditionalInformation = {
	__typename?: "BillingAdditionalInformation";
	_id: Scalars["ID"];
	createdBy: ConningUser;
	gridName: Scalars["String"];
	name: Scalars["String"];
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type BillingBaseRowGraph = {
	__typename?: "BillingBaseRowGraph";
	chargeType: Scalars["String"];
	computationCharge?: Maybe<Scalars["Float"]>;
	dataElements?: Maybe<Scalars["Float"]>;
	dataServingCharge?: Maybe<Scalars["Float"]>;
	dataServingChargePerHour?: Maybe<Scalars["Float"]>;
	dataStorageCharge?: Maybe<Scalars["Float"]>;
	dataStorageChargePerDay?: Maybe<Scalars["Float"]>;
	duration?: Maybe<Scalars["Float"]>;
	finishDateTime?: Maybe<Scalars["Date"]>;
	flags: Array<Scalars["String"]>;
	hasDataServingCharge: Scalars["Boolean"];
	hasDataStorageCharge: Scalars["Boolean"];
	instanceType?: Maybe<Scalars["String"]>;
	maximumVCPUs?: Maybe<Scalars["Int"]>;
	ongoingDataStorageChargePerDay?: Maybe<Scalars["Float"]>;
	startDateTime: Scalars["Date"];
	totalCharge?: Maybe<Scalars["Float"]>;
	totalCPUTime?: Maybe<Scalars["Float"]>;
	user?: Maybe<ConningUser>;
};

export type BillingJobGraph = {
	__typename?: "BillingJobGraph";
	additionalInformation?: Maybe<BillingAdditionalInformation>;
	details?: Maybe<Array<Maybe<BillingBaseRowGraph>>>;
	total?: Maybe<BillingBaseRowGraph>;
};

export type BillingQueryGraph = {
	__typename?: "BillingQueryGraph";
	report?: Maybe<BillingReportSummaryGraph>;
};

export type BillingQueryGraphReportArgs = {
	startDate: Scalars["Date"];
	endDate: Scalars["Date"];
	users: Array<Maybe<Scalars["String"]>>;
	applications: Array<Maybe<Scalars["String"]>>;
};

export type BillingReportSummaryGraph = {
	__typename?: "BillingReportSummaryGraph";
	endDate?: Maybe<Scalars["Date"]>;
	simulationSummary?: Maybe<BillingSummaryGraph>;
	startDate?: Maybe<Scalars["Date"]>;
};

export type BillingSummaryGraph = {
	__typename?: "BillingSummaryGraph";
	billingJobRows?: Maybe<Array<Maybe<BillingJobGraph>>>;
	total?: Maybe<BillingBaseRowGraph>;
};

export type ConfigGraph = {
	__typename?: "ConfigGraph";
	kui: KuiConfigGraph;
	omdb: OmdbConfigGraph;
};

export type DbObject = {
	__typename?: "DbObject";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type DesktopNotification = {
	__typename?: "DesktopNotification";
	/** Message text to display */
	message: Scalars["String"];
	/** Time in ms before fading out */
	timeout: Scalars["Float"];
	title: Scalars["String"];
	/** Should always match the bearer's ID */
	userId: Scalars["String"];
};

export type DistinctTagValuesInput = {
	__typename?: "DistinctTagValuesInput";
	searchText?: Maybe<Scalars["String"]>;
	tags: Array<Scalars["String"]>;
	where?: Maybe<Scalars["Json"]>;
};

export type Ec2Instance = {
	__typename?: "Ec2Instance";
	hostname?: Maybe<Scalars["String"]>;
	instanceId?: Maybe<Scalars["String"]>;
	instanceType?: Maybe<Scalars["String"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type FileType = DbObject & {
	__typename?: "FileType";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	extension: Scalars["String"];
	icon?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	name: Scalars["String"];
	objectType?: Maybe<Scalars["ID"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type Folder = DbObject &
	Ui & {
		__typename?: "Folder";
		_id: Scalars["ID"];
		contents?: Maybe<Array<FolderItem>>;
		createdBy?: Maybe<ConningUser>;
		createdTime?: Maybe<Scalars["Date"]>;
		hasChildren?: Maybe<Scalars["Boolean"]>;
		modifiedBy?: Maybe<ConningUser>;
		modifiedTime?: Maybe<Scalars["Date"]>;
		name: Scalars["String"];
		path?: Maybe<Scalars["String"]>;
		userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
	};

export type FolderItem = DbObject & {
	__typename?: "FolderItem";
	_folder: Folder;
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	item?: Maybe<Omdb_Union>;
	itemId: Scalars["ID"];
	itemType: Scalars["String"];
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type FolderItemInputType = {
	itemId?: Maybe<Scalars["ObjectId"]>;
	objectType: Scalars["String"];
};

export type GraphMutation = {
	__typename?: "GraphMutation";
	kui?: Maybe<KuiMutationGraph>;
	notification?: Maybe<NotificationMutation>;
	omdb?: Maybe<Omdb_Mutations>;
	queryTool?: Maybe<QueryToolMutationGraph>;
};

export type GraphQuery = {
	__typename?: "GraphQuery";
	billing?: Maybe<BillingQueryGraph>;
	config?: Maybe<ConfigGraph>;
	kui?: Maybe<KuiQueryGraph>;
	notification?: Maybe<NotificationQueryGraphType>;
	omdb?: Maybe<OmdbQuery>;
	user?: Maybe<UserQuery>;
};

export type GraphSubscriptions = {
	__typename?: "GraphSubscriptions";
	notification?: Maybe<DesktopNotification>;
	omdb_changed?: Maybe<OmdbUpdateEventGraph>;
};

export type GridStatus = DbObject & {
	__typename?: "GridStatus";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	gridId?: Maybe<Scalars["String"]>;
	gridName?: Maybe<Scalars["String"]>;
	jobs?: Maybe<Array<Maybe<Job>>>;
	linuxInstances?: Maybe<Array<Maybe<Ec2Instance>>>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	power?: Maybe<Scalars["String"]>;
	timeStamp?: Maybe<Scalars["Date"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
	version?: Maybe<Scalars["String"]>;
	windowsInstances?: Maybe<Array<Maybe<Ec2Instance>>>;
};

export type InvestmentOptimization = DbObject &
	Ui & {
		__typename?: "InvestmentOptimization";
		_id: Scalars["ID"];
		archived?: Maybe<Scalars["Boolean"]>;
		billingInformation?: Maybe<InvestmentOptimizationBillingInfo>;
		createdBy?: Maybe<ConningUser>;
		createdTime?: Maybe<Scalars["Date"]>;
		deletedTime?: Maybe<Scalars["Date"]>;
		dfioPath?: Maybe<Scalars["String"]>;
		gridName?: Maybe<Scalars["String"]>;
		jobIds?: Maybe<Array<Scalars["ID"]>>;
		modifiedBy?: Maybe<ConningUser>;
		modifiedTime?: Maybe<Scalars["Date"]>;
		name: Scalars["String"];
		path?: Maybe<Scalars["String"]>;
		scenarios?: Maybe<Scalars["Int"]>;
		size?: Maybe<Scalars["String"]>;
		status?: Maybe<Scalars["String"]>;
		userInterfaceSavedToS3?: Maybe<Scalars["Boolean"]>;
		userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
		version?: Maybe<Scalars["String"]>;
	};

export type InvestmentOptimizationBillingInfo = {
	__typename?: "InvestmentOptimizationBillingInfo";
	elements?: Maybe<Scalars["Float"]>;
	optimizationEndTime?: Maybe<Scalars["Date"]>;
	optimizationStartTime?: Maybe<Scalars["Date"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type InvestmentOptimizationSession = DbObject & {
	__typename?: "InvestmentOptimizationSession";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	endTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	optimization?: Maybe<InvestmentOptimization>;
	startTime?: Maybe<Scalars["Date"]>;
	userSessions?: Maybe<Array<Maybe<UserSession>>>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
	version?: Maybe<Scalars["String"]>;
};

export type Job = {
	__typename?: "Job";
	instances?: Maybe<Array<Maybe<Ec2Instance>>>;
	jobId?: Maybe<Scalars["String"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type JsonObjectGraph = {
	__typename?: "JsonObjectGraph";
	json?: Maybe<Scalars["Json"]>;
};

export type KuiConfigGraph = {
	__typename?: "KuiConfigGraph";
	jkRegistrationPort: Scalars["Int"];
	jkTraceLevel: Scalars["Int"];
	kuiInfoPort: Scalars["Int"];
	logPath?: Maybe<Scalars["String"]>;
	profileK: Scalars["Boolean"];
	useJava: Scalars["Boolean"];
};

export type KuiInstanceDevMutations = {
	__typename?: "KuiInstanceDevMutations";
	kExec?: Maybe<Scalars["Json"]>;
	setLogLevel?: Maybe<Scalars["String"]>;
};

export type KuiInstanceDevMutationsKExecArgs = {
	cmd: Scalars["String"];
};

export type KuiInstanceDevMutationsSetLogLevelArgs = {
	level: Scalars["String"];
};

export type KuiInstanceGraph = {
	__typename?: "KuiInstanceGraph";
	host: Scalars["String"];
	id?: Maybe<Scalars["String"]>;
	jobID?: Maybe<Scalars["String"]>;
	kid: Scalars["String"];
	kSessionGuid?: Maybe<Scalars["String"]>;
	models?: Maybe<Array<Maybe<KWidgetModelGraph>>>;
	parentkid?: Maybe<Scalars["String"]>;
	registrationTime: Scalars["Date"];
};

export type KuiInstanceMutationGraph = {
	__typename?: "KuiInstanceMutationGraph";
	dev?: Maybe<KuiInstanceDevMutations>;
	model?: Maybe<KWidgetModelMutationGraph>;
	testRunner?: Maybe<KuiInstanceTestMutations>;
};

export type KuiInstanceMutationGraphModelArgs = {
	name: Scalars["String"];
};

export type KuiInstanceTestMutations = {
	__typename?: "KuiInstanceTestMutations";
	play?: Maybe<Scalars["String"]>;
	record?: Maybe<KuiInstanceGraph>;
	stop?: Maybe<Scalars["String"]>;
};

export type KuiMutationGraph = {
	__typename?: "KuiMutationGraph";
	instance?: Maybe<KuiInstanceMutationGraph>;
};

export type KuiMutationGraphInstanceArgs = {
	kid: Scalars["String"];
};

export type KuiQueryGraph = {
	__typename?: "KuiQueryGraph";
	config: KuiConfigGraph;
	instances?: Maybe<Array<Maybe<KuiInstanceGraph>>>;
};

export type KWidgetModelGraph = {
	__typename?: "KWidgetModelGraph";
	children?: Maybe<Array<Maybe<Scalars["String"]>>>;
	class?: Maybe<Scalars["String"]>;
	name: Scalars["String"];
	parent?: Maybe<Scalars["String"]>;
};

export type KWidgetModelMutationGraph = {
	__typename?: "KWidgetModelMutationGraph";
	sendToK?: Maybe<Scalars["Boolean"]>;
};

export type KWidgetModelMutationGraphSendToKArgs = {
	input: SendToKInput;
};

export type ModifySubscriptionInput = {
	target?: Maybe<NotificationTarget>;
	trigger?: Maybe<Scalars["String"]>;
	severity?: Maybe<Scalars["String"]>;
	email?: Maybe<Scalars["Boolean"]>;
	emailSecondary?: Maybe<Scalars["Boolean"]>;
	mobile?: Maybe<Scalars["Boolean"]>;
	desktop?: Maybe<Scalars["Boolean"]>;
	extra?: Maybe<Scalars["Json"]>;
	scope?: Maybe<Scalars["String"]>;
};

export type NotificationMutation = {
	__typename?: "NotificationMutation";
	test?: Maybe<TestNotificationSubscriptionMutation>;
	updateSubscriptions?: Maybe<Array<Maybe<NotificationSubscription>>>;
};

export type NotificationMutationUpdateSubscriptionsArgs = {
	subscriptions: Array<Maybe<ModifySubscriptionInput>>;
};

export type NotificationQueryGraphType = {
	__typename?: "NotificationQueryGraphType";
	sent?: Maybe<Array<Maybe<SentNotificationType>>>;
	subscriptions?: Maybe<Array<Maybe<NotificationSubscription>>>;
};

export type NotificationQueryGraphTypeSubscriptionsArgs = {
	scope: Scalars["String"];
};

export type NotificationSubscription = {
	__typename?: "NotificationSubscription";
	/** Unique ID */
	_id?: Maybe<Scalars["String"]>;
	desktop?: Maybe<Scalars["Boolean"]>;
	email?: Maybe<Scalars["Boolean"]>;
	emailSecondary?: Maybe<Scalars["Boolean"]>;
	/** Any additional parameters (dollar threshold, timespan, etc) */
	extra?: Maybe<Scalars["Json"]>;
	mobile?: Maybe<Scalars["Boolean"]>;
	/** The severity level of the trigger */
	severity?: Maybe<Scalars["String"]>;
	/** The category (system/billing/simulation) for the subscription. */
	target?: Maybe<NotificationTarget>;
	/** The specific event (grid powered off, simulation finished, etc...) */
	trigger?: Maybe<Scalars["String"]>;
};

export enum NotificationTarget {
	/** Billing Events */
	Billing = "billing",
	/** Simulation Events */
	Simulation = "simulation",
	/** System Events */
	System = "system"
}

export type Omdb_Arrangement_Insert = {
	columnAxes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	columns?: Maybe<Scalars["Int"]>;
	rowAxes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	rows?: Maybe<Scalars["Int"]>;
};

export type Omdb_Arrangement_Update = {
	columnAxes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	columns?: Maybe<Scalars["Int"]>;
	rowAxes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	rows?: Maybe<Scalars["Int"]>;
};

export type Omdb_BillingAdditionalInformation = {
	__typename?: "omdb_BillingAdditionalInformation";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_BillingAdditionalInformation_QueryResult>;
	get?: Maybe<BillingAdditionalInformation>;
	gets?: Maybe<Array<Maybe<BillingAdditionalInformation>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_BillingAdditionalInformationDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_BillingAdditionalInformation_Input;
};

export type Omdb_BillingAdditionalInformationFindArgs = {
	input: Omdb_BillingAdditionalInformation_QueryResultInput;
};

export type Omdb_BillingAdditionalInformationGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_BillingAdditionalInformationGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_BillingAdditionalInformation_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	gridName?: Maybe<Array<Maybe<Scalars["String"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type Omdb_BillingAdditionalInformation_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	gridName: Scalars["String"];
	createdBy: Scalars["ID"];
};

export type Omdb_BillingAdditionalInformation_Mutation = {
	__typename?: "omdb_BillingAdditionalInformation_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<BillingAdditionalInformation>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_BillingAdditionalInformation_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_BillingAdditionalInformation_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_BillingAdditionalInformation_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_BillingAdditionalInformation_MutationInsertArgs = {
	values: Array<Maybe<Omdb_BillingAdditionalInformation_Insert>>;
};

export type Omdb_BillingAdditionalInformation_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_BillingAdditionalInformation_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_BillingAdditionalInformation_Update;
};

export type Omdb_BillingAdditionalInformation_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_BillingAdditionalInformation_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_BillingAdditionalInformation_QueryResult = {
	__typename?: "omdb_BillingAdditionalInformation_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<BillingAdditionalInformation>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_BillingAdditionalInformation_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_BillingAdditionalInformation_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_BillingAdditionalInformation_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	gridName?: Maybe<Scalars["String"]>;
	createdBy?: Maybe<Scalars["ID"]>;
};

export type Omdb_Distinct_TagValues = {
	__typename?: "omdb_distinct_tagValues";
	distinct?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	isUserTag: Scalars["Boolean"];
	tagName: Scalars["String"];
	tagType: Scalars["String"];
};

export type Omdb_Distinct_Untyped = {
	__typename?: "omdb_distinct_untyped";
	objectType?: Maybe<Scalars["String"]>;
	tags?: Maybe<Array<Maybe<Omdb_Distinct_TagValues>>>;
};

export type Omdb_Ec2Instance_Insert = {
	instanceId?: Maybe<Scalars["String"]>;
	hostname?: Maybe<Scalars["String"]>;
	instanceType?: Maybe<Scalars["String"]>;
};

export type Omdb_Ec2Instance_Update = {
	instanceId?: Maybe<Scalars["String"]>;
	hostname?: Maybe<Scalars["String"]>;
	instanceType?: Maybe<Scalars["String"]>;
};

export type Omdb_FileType = {
	__typename?: "omdb_FileType";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_FileType_QueryResult>;
	get?: Maybe<FileType>;
	gets?: Maybe<Array<Maybe<FileType>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_FileTypeDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_FileType_Input;
};

export type Omdb_FileTypeFindArgs = {
	input: Omdb_FileType_QueryResultInput;
};

export type Omdb_FileTypeGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_FileTypeGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_FileType_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	icon?: Maybe<Array<Maybe<Scalars["String"]>>>;
	extension?: Maybe<Array<Maybe<Scalars["String"]>>>;
	objectType?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_FileType_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	icon?: Maybe<Scalars["String"]>;
	extension: Scalars["String"];
	objectType?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_FileType_Mutation = {
	__typename?: "omdb_FileType_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<FileType>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_FileType_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_FileType_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_FileType_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_FileType_MutationInsertArgs = {
	values: Array<Maybe<Omdb_FileType_Insert>>;
};

export type Omdb_FileType_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_FileType_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_FileType_Update;
};

export type Omdb_FileType_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_FileType_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_FileType_QueryResult = {
	__typename?: "omdb_FileType_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<FileType>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_FileType_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_FileType_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_FileType_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	icon?: Maybe<Scalars["String"]>;
	extension?: Maybe<Scalars["String"]>;
	objectType?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_Folder = {
	__typename?: "omdb_Folder";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_Folder_QueryResult>;
	get?: Maybe<Folder>;
	gets?: Maybe<Array<Maybe<Folder>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_FolderDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_Folder_Input;
};

export type Omdb_FolderFindArgs = {
	input: Omdb_Folder_QueryResultInput;
};

export type Omdb_FolderGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_FolderGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_Folder_Input = {
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	path?: Maybe<Array<Maybe<Scalars["String"]>>>;
	contents?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_Folder_Insert = {
	name: Scalars["String"];
	path?: Maybe<Scalars["String"]>;
	_id?: Maybe<Scalars["ID"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_Folder_Mutation = {
	__typename?: "omdb_Folder_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<Folder>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_Folder_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Folder_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_Folder_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_Folder_MutationInsertArgs = {
	values: Array<Maybe<Omdb_Folder_Insert>>;
};

export type Omdb_Folder_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Folder_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_Folder_Update;
};

export type Omdb_Folder_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_Folder_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_Folder_Mutations = {
	__typename?: "omdb_folder_mutations";
	addItems?: Maybe<Scalars["Json"]>;
	newFolder?: Maybe<Folder>;
	rename?: Maybe<Folder>;
};

export type Omdb_Folder_MutationsAddItemsArgs = {
	folderId: Scalars["ObjectId"];
	items: Array<FolderItemInputType>;
};

export type Omdb_Folder_MutationsNewFolderArgs = {
	path: Scalars["String"];
	name: Scalars["String"];
};

export type Omdb_Folder_MutationsRenameArgs = {
	id: Scalars["ObjectId"];
	name: Scalars["String"];
};

export type Omdb_Folder_QueryResult = {
	__typename?: "omdb_Folder_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<Folder>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_Folder_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_Folder_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_Folder_Update = {
	name?: Maybe<Scalars["String"]>;
	path?: Maybe<Scalars["String"]>;
	_id?: Maybe<Scalars["ID"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_FolderItem = {
	__typename?: "omdb_FolderItem";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_FolderItem_QueryResult>;
	get?: Maybe<FolderItem>;
	gets?: Maybe<Array<Maybe<FolderItem>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_FolderItemDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_FolderItem_Input;
};

export type Omdb_FolderItemFindArgs = {
	input: Omdb_FolderItem_QueryResultInput;
};

export type Omdb_FolderItemGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_FolderItemGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_FolderItem_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	_folder?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	itemType?: Maybe<Array<Maybe<Scalars["String"]>>>;
	itemId?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type Omdb_FolderItem_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	_folder: Scalars["ID"];
	itemType: Scalars["String"];
	itemId: Scalars["ID"];
};

export type Omdb_FolderItem_Mutation = {
	__typename?: "omdb_FolderItem_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<FolderItem>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_FolderItem_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_FolderItem_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_FolderItem_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_FolderItem_MutationInsertArgs = {
	values: Array<Maybe<Omdb_FolderItem_Insert>>;
};

export type Omdb_FolderItem_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_FolderItem_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_FolderItem_Update;
};

export type Omdb_FolderItem_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_FolderItem_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_FolderItem_QueryResult = {
	__typename?: "omdb_FolderItem_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<FolderItem>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_FolderItem_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_FolderItem_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_FolderItem_Update = {
	_id?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	_folder?: Maybe<Scalars["ID"]>;
	itemType?: Maybe<Scalars["String"]>;
	itemId?: Maybe<Scalars["ID"]>;
};

export type Omdb_Generic_Graph = {
	__typename?: "omdb_generic_graph";
	/** Group by the specified tags and detemine unique values and counts.  Suitable
	 * for use in a catalog sidebar drilldown component.
	 */
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_QueryResult>;
	get?: Maybe<Omdb_Union>;
	gets?: Maybe<Array<Maybe<Omdb_Union>>>;
};

export type Omdb_Generic_GraphDistinctArgs = {
	input: OmdbDistinctInput;
};

export type Omdb_Generic_GraphFindArgs = {
	input: Omdb_QueryResultInput;
};

export type Omdb_Generic_GraphGetArgs = {
	_id: Scalars["ID"];
	objectType: Scalars["String"];
};

export type Omdb_Generic_GraphGetsArgs = {
	_ids: Array<Scalars["ID"]>;
	objectType: Scalars["String"];
};

export type Omdb_Generic_Mutations = {
	__typename?: "omdb_generic_mutations";
	delete?: Maybe<Scalars["String"]>;
	register?: Maybe<Scalars["String"]>;
};

export type Omdb_Generic_MutationsDeleteArgs = {
	name: Scalars["String"];
};

export type Omdb_Generic_MutationsRegisterArgs = {
	schema: Scalars["String"];
};

export type Omdb_GridStatus = {
	__typename?: "omdb_GridStatus";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_GridStatus_QueryResult>;
	get?: Maybe<GridStatus>;
	gets?: Maybe<Array<Maybe<GridStatus>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_GridStatusDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_GridStatus_Input;
};

export type Omdb_GridStatusFindArgs = {
	input: Omdb_GridStatus_QueryResultInput;
};

export type Omdb_GridStatusGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_GridStatusGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_GridStatus_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	windowsInstances?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	linuxInstances?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	jobs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	timeStamp?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	gridName?: Maybe<Array<Maybe<Scalars["String"]>>>;
	gridId?: Maybe<Array<Maybe<Scalars["String"]>>>;
	power?: Maybe<Array<Maybe<Scalars["String"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_GridStatus_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	windowsInstances?: Maybe<Array<Maybe<Omdb_Ec2Instance_Insert>>>;
	linuxInstances?: Maybe<Array<Maybe<Omdb_Ec2Instance_Insert>>>;
	jobs?: Maybe<Array<Maybe<Omdb_Job_Insert>>>;
	timeStamp?: Maybe<Scalars["Date"]>;
	gridName?: Maybe<Scalars["String"]>;
	gridId?: Maybe<Scalars["String"]>;
	power?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_GridStatus_Mutation = {
	__typename?: "omdb_GridStatus_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<GridStatus>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_GridStatus_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_GridStatus_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_GridStatus_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_GridStatus_MutationInsertArgs = {
	values: Array<Maybe<Omdb_GridStatus_Insert>>;
};

export type Omdb_GridStatus_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_GridStatus_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_GridStatus_Update;
};

export type Omdb_GridStatus_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_GridStatus_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_GridStatus_QueryResult = {
	__typename?: "omdb_GridStatus_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<GridStatus>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_GridStatus_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_GridStatus_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_GridStatus_Update = {
	_id?: Maybe<Scalars["ID"]>;
	windowsInstances?: Maybe<Array<Maybe<Omdb_Ec2Instance_Update>>>;
	linuxInstances?: Maybe<Array<Maybe<Omdb_Ec2Instance_Update>>>;
	jobs?: Maybe<Array<Maybe<Omdb_Job_Update>>>;
	timeStamp?: Maybe<Scalars["Date"]>;
	gridName?: Maybe<Scalars["String"]>;
	gridId?: Maybe<Scalars["String"]>;
	power?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_InvestmentOptimization = {
	__typename?: "omdb_InvestmentOptimization";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_InvestmentOptimization_QueryResult>;
	get?: Maybe<InvestmentOptimization>;
	gets?: Maybe<Array<Maybe<InvestmentOptimization>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_InvestmentOptimizationDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_InvestmentOptimization_Input;
};

export type Omdb_InvestmentOptimizationFindArgs = {
	input: Omdb_InvestmentOptimization_QueryResultInput;
};

export type Omdb_InvestmentOptimizationGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_InvestmentOptimizationGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_InvestmentOptimization_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	jobIds?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	archived?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	scenarios?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	status?: Maybe<Array<Maybe<Scalars["String"]>>>;
	gridName?: Maybe<Array<Maybe<Scalars["String"]>>>;
	path?: Maybe<Array<Maybe<Scalars["String"]>>>;
	dfioPath?: Maybe<Array<Maybe<Scalars["String"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	size?: Maybe<Array<Maybe<Scalars["String"]>>>;
	userInterfaceSavedToS3?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	billingInformation?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	deletedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_InvestmentOptimization_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	jobIds?: Maybe<Array<Scalars["ID"]>>;
	archived?: Maybe<Scalars["Boolean"]>;
	scenarios?: Maybe<Scalars["Int"]>;
	status?: Maybe<Scalars["String"]>;
	gridName?: Maybe<Scalars["String"]>;
	path?: Maybe<Scalars["String"]>;
	dfioPath?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	size?: Maybe<Scalars["String"]>;
	userInterfaceSavedToS3?: Maybe<Scalars["Boolean"]>;
	billingInformation?: Maybe<Omdb_InvestmentOptimizationBillingInfo_Insert>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	deletedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_InvestmentOptimization_Mutation = {
	__typename?: "omdb_InvestmentOptimization_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<InvestmentOptimization>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_InvestmentOptimization_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_InvestmentOptimization_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_InvestmentOptimization_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_InvestmentOptimization_MutationInsertArgs = {
	values: Array<Maybe<Omdb_InvestmentOptimization_Insert>>;
};

export type Omdb_InvestmentOptimization_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_InvestmentOptimization_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_InvestmentOptimization_Update;
};

export type Omdb_InvestmentOptimization_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_InvestmentOptimization_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_InvestmentOptimization_QueryResult = {
	__typename?: "omdb_InvestmentOptimization_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<InvestmentOptimization>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_InvestmentOptimization_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_InvestmentOptimization_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_InvestmentOptimization_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	jobIds?: Maybe<Array<Scalars["ID"]>>;
	archived?: Maybe<Scalars["Boolean"]>;
	scenarios?: Maybe<Scalars["Int"]>;
	status?: Maybe<Scalars["String"]>;
	gridName?: Maybe<Scalars["String"]>;
	path?: Maybe<Scalars["String"]>;
	dfioPath?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	size?: Maybe<Scalars["String"]>;
	userInterfaceSavedToS3?: Maybe<Scalars["Boolean"]>;
	billingInformation?: Maybe<Omdb_InvestmentOptimizationBillingInfo_Update>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	deletedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_InvestmentOptimizationBillingInfo_Insert = {
	optimizationStartTime?: Maybe<Scalars["Date"]>;
	optimizationEndTime?: Maybe<Scalars["Date"]>;
	elements?: Maybe<Scalars["Float"]>;
};

export type Omdb_InvestmentOptimizationBillingInfo_Update = {
	optimizationStartTime?: Maybe<Scalars["Date"]>;
	optimizationEndTime?: Maybe<Scalars["Date"]>;
	elements?: Maybe<Scalars["Float"]>;
};

export type Omdb_InvestmentOptimizationSession = {
	__typename?: "omdb_InvestmentOptimizationSession";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_InvestmentOptimizationSession_QueryResult>;
	get?: Maybe<InvestmentOptimizationSession>;
	gets?: Maybe<Array<Maybe<InvestmentOptimizationSession>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_InvestmentOptimizationSessionDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_InvestmentOptimizationSession_Input;
};

export type Omdb_InvestmentOptimizationSessionFindArgs = {
	input: Omdb_InvestmentOptimizationSession_QueryResultInput;
};

export type Omdb_InvestmentOptimizationSessionGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_InvestmentOptimizationSessionGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_InvestmentOptimizationSession_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	optimization?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	startTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	endTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	userSessions?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_InvestmentOptimizationSession_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	optimization?: Maybe<Scalars["ID"]>;
	startTime?: Maybe<Scalars["Date"]>;
	endTime?: Maybe<Scalars["Date"]>;
	userSessions?: Maybe<Array<Maybe<Omdb_UserSession_Insert>>>;
	version?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_InvestmentOptimizationSession_Mutation = {
	__typename?: "omdb_InvestmentOptimizationSession_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<InvestmentOptimizationSession>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_InvestmentOptimizationSession_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_InvestmentOptimizationSession_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_InvestmentOptimizationSession_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_InvestmentOptimizationSession_MutationInsertArgs = {
	values: Array<Maybe<Omdb_InvestmentOptimizationSession_Insert>>;
};

export type Omdb_InvestmentOptimizationSession_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_InvestmentOptimizationSession_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_InvestmentOptimizationSession_Update;
};

export type Omdb_InvestmentOptimizationSession_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_InvestmentOptimizationSession_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_InvestmentOptimizationSession_QueryResult = {
	__typename?: "omdb_InvestmentOptimizationSession_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<InvestmentOptimizationSession>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_InvestmentOptimizationSession_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_InvestmentOptimizationSession_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_InvestmentOptimizationSession_Update = {
	_id?: Maybe<Scalars["ID"]>;
	optimization?: Maybe<Scalars["ID"]>;
	startTime?: Maybe<Scalars["Date"]>;
	endTime?: Maybe<Scalars["Date"]>;
	userSessions?: Maybe<Array<Maybe<Omdb_UserSession_Update>>>;
	version?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_Job_Insert = {
	jobId?: Maybe<Scalars["String"]>;
	instances?: Maybe<Array<Maybe<Omdb_Ec2Instance_Insert>>>;
};

export type Omdb_Job_Update = {
	jobId?: Maybe<Scalars["String"]>;
	instances?: Maybe<Array<Maybe<Omdb_Ec2Instance_Update>>>;
};

export type Omdb_Mutations = {
	__typename?: "omdb_mutations";
	admin?: Maybe<OmdbAdminMutationObjectGraph>;
	folder?: Maybe<Omdb_Folder_Mutations>;
	objectTypes?: Maybe<Omdb_Generic_Mutations>;
	typed?: Maybe<Omdb_Typed_Mutations>;
};

export type Omdb_Period_Insert = {
	year?: Maybe<Scalars["Int"]>;
	quarter?: Maybe<Scalars["Int"]>;
	month?: Maybe<Scalars["Int"]>;
	eulerPeriod?: Maybe<Scalars["Int"]>;
};

export type Omdb_Period_Update = {
	year?: Maybe<Scalars["Int"]>;
	quarter?: Maybe<Scalars["Int"]>;
	month?: Maybe<Scalars["Int"]>;
	eulerPeriod?: Maybe<Scalars["Int"]>;
};

export type Omdb_Query = {
	__typename?: "omdb_Query";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_Query_QueryResult>;
	get?: Maybe<Query>;
	gets?: Maybe<Array<Maybe<Query>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_QueryDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_Query_Input;
};

export type Omdb_QueryFindArgs = {
	input: Omdb_Query_QueryResultInput;
};

export type Omdb_QueryGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_QueryGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_Query_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	archived?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	simulations?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	variables?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	hasResult?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	result?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	querySave?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	scenarios?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	periods?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	frequencies?: Maybe<Array<Maybe<Scalars["String"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	billingInformation?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_Query_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	archived?: Maybe<Scalars["Boolean"]>;
	simulations: Array<Scalars["ID"]>;
	name: Scalars["String"];
	variables?: Maybe<Scalars["Int"]>;
	hasResult?: Maybe<Scalars["Boolean"]>;
	result?: Maybe<Omdb_QueryResult_Insert>;
	querySave?: Maybe<Scalars["Json"]>;
	scenarios?: Maybe<Scalars["Int"]>;
	periods?: Maybe<Omdb_Period_Insert>;
	frequencies?: Maybe<Array<Scalars["String"]>>;
	version?: Maybe<Scalars["String"]>;
	billingInformation?: Maybe<Omdb_QueryBillingInfo_Insert>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_Query_Mutation = {
	__typename?: "omdb_Query_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<Query>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_Query_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Query_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_Query_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_Query_MutationInsertArgs = {
	values: Array<Maybe<Omdb_Query_Insert>>;
};

export type Omdb_Query_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Query_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_Query_Update;
};

export type Omdb_Query_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_Query_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_Query_QueryResult = {
	__typename?: "omdb_Query_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<Query>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_Query_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_Query_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_Query_Update = {
	_id?: Maybe<Scalars["ID"]>;
	archived?: Maybe<Scalars["Boolean"]>;
	simulations?: Maybe<Array<Scalars["ID"]>>;
	name?: Maybe<Scalars["String"]>;
	variables?: Maybe<Scalars["Int"]>;
	hasResult?: Maybe<Scalars["Boolean"]>;
	result?: Maybe<Omdb_QueryResult_Update>;
	querySave?: Maybe<Scalars["Json"]>;
	scenarios?: Maybe<Scalars["Int"]>;
	periods?: Maybe<Omdb_Period_Update>;
	frequencies?: Maybe<Array<Scalars["String"]>>;
	version?: Maybe<Scalars["String"]>;
	billingInformation?: Maybe<Omdb_QueryBillingInfo_Update>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_QueryBillingInfo_Insert = {
	sessionStartTime?: Maybe<Scalars["Date"]>;
	sessionEndTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_QueryBillingInfo_Update = {
	sessionStartTime?: Maybe<Scalars["Date"]>;
	sessionEndTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_QueryResult = {
	__typename?: "omdb_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<Omdb_Union>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_QueryResult_Insert = {
	name?: Maybe<Scalars["String"]>;
	ready?: Maybe<Scalars["Boolean"]>;
	default_arrangement?: Maybe<Omdb_Arrangement_Insert>;
	shape?: Maybe<Array<Scalars["Int"]>>;
	singularAxisCoordinate?: Maybe<
		Array<Maybe<Omdb_SingularAxisCoordinate_Insert>>
	>;
	availableViews?: Maybe<Array<Maybe<Omdb_View_Insert>>>;
	userOptions?: Maybe<Scalars["Json"]>;
};

export type Omdb_QueryResult_Update = {
	name?: Maybe<Scalars["String"]>;
	ready?: Maybe<Scalars["Boolean"]>;
	default_arrangement?: Maybe<Omdb_Arrangement_Update>;
	shape?: Maybe<Array<Scalars["Int"]>>;
	singularAxisCoordinate?: Maybe<
		Array<Maybe<Omdb_SingularAxisCoordinate_Update>>
	>;
	availableViews?: Maybe<Array<Maybe<Omdb_View_Update>>>;
	userOptions?: Maybe<Scalars["Json"]>;
};

export type Omdb_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Scalars["Json"]>;
	objectTypes?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_QueryRun_Input = {
	__typename?: "omdb_queryRun_input";
	limit: Scalars["Int"];
	objectTypes?: Maybe<Array<Maybe<Scalars["String"]>>>;
	searchText: Scalars["String"];
	sortBy: Scalars["String"];
	sortOrder: Scalars["String"];
	where?: Maybe<Scalars["Json"]>;
};

export type Omdb_QuerySession_Insert = {
	startTime?: Maybe<Scalars["Date"]>;
	queryId?: Maybe<Scalars["String"]>;
	userId?: Maybe<Scalars["ID"]>;
};

export type Omdb_QuerySession_Update = {
	startTime?: Maybe<Scalars["Date"]>;
	queryId?: Maybe<Scalars["String"]>;
	userId?: Maybe<Scalars["ID"]>;
};

export type Omdb_Report = {
	__typename?: "omdb_Report";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_Report_QueryResult>;
	get?: Maybe<Report>;
	gets?: Maybe<Array<Maybe<Report>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_ReportDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_Report_Input;
};

export type Omdb_ReportFindArgs = {
	input: Omdb_Report_QueryResultInput;
};

export type Omdb_ReportGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_ReportGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_Report_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	reportItems?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_Report_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	reportItems?: Maybe<Array<Scalars["Json"]>>;
	version?: Maybe<Scalars["String"]>;
};

export type Omdb_Report_Mutation = {
	__typename?: "omdb_Report_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<Report>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_Report_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Report_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_Report_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_Report_MutationInsertArgs = {
	values: Array<Maybe<Omdb_Report_Insert>>;
};

export type Omdb_Report_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Report_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_Report_Update;
};

export type Omdb_Report_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_Report_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_Report_QueryResult = {
	__typename?: "omdb_Report_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<Report>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_Report_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_Report_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_Report_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	reportItems?: Maybe<Array<Scalars["Json"]>>;
	version?: Maybe<Scalars["String"]>;
};

export type Omdb_S3File = {
	__typename?: "omdb_S3File";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_S3File_QueryResult>;
	get?: Maybe<S3File>;
	gets?: Maybe<Array<Maybe<S3File>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_S3FileDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_S3File_Input;
};

export type Omdb_S3FileFindArgs = {
	input: Omdb_S3File_QueryResultInput;
};

export type Omdb_S3FileGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_S3FileGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_S3File_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	defaultName?: Maybe<Array<Maybe<Scalars["String"]>>>;
	s3Key?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	type?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	for?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type Omdb_S3File_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	defaultName?: Maybe<Scalars["String"]>;
	s3Key: Scalars["ID"];
	type?: Maybe<Scalars["ID"]>;
	for?: Maybe<Scalars["ID"]>;
};

export type Omdb_S3File_Mutation = {
	__typename?: "omdb_S3File_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<S3File>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_S3File_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_S3File_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_S3File_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_S3File_MutationInsertArgs = {
	values: Array<Maybe<Omdb_S3File_Insert>>;
};

export type Omdb_S3File_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_S3File_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_S3File_Update;
};

export type Omdb_S3File_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_S3File_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_S3File_QueryResult = {
	__typename?: "omdb_S3File_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<S3File>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_S3File_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_S3File_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_S3File_Update = {
	_id?: Maybe<Scalars["ID"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	defaultName?: Maybe<Scalars["String"]>;
	s3Key?: Maybe<Scalars["ID"]>;
	type?: Maybe<Scalars["ID"]>;
	for?: Maybe<Scalars["ID"]>;
};

export type Omdb_ScenarioSummary_Insert = {
	storageBlocks?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	storageBlockByScenario?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	relativeIndicesByScenario?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	scenariosByStorageBlock?: Maybe<
		Array<Maybe<Omdb_StorageBlockScenario_Insert>>
	>;
	numberScenariosPerSimulationBlock?: Maybe<Scalars["Int"]>;
	actualStorageBlockBySimulationBlock?: Maybe<
		Array<Maybe<Omdb_SimulationBlock_Insert>>
	>;
	targetStorageBlockBySimulationBlock?: Maybe<
		Array<Maybe<Omdb_SimulationBlock_Insert>>
	>;
};

export type Omdb_ScenarioSummary_Update = {
	storageBlocks?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	storageBlockByScenario?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	relativeIndicesByScenario?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	scenariosByStorageBlock?: Maybe<
		Array<Maybe<Omdb_StorageBlockScenario_Update>>
	>;
	numberScenariosPerSimulationBlock?: Maybe<Scalars["Int"]>;
	actualStorageBlockBySimulationBlock?: Maybe<
		Array<Maybe<Omdb_SimulationBlock_Update>>
	>;
	targetStorageBlockBySimulationBlock?: Maybe<
		Array<Maybe<Omdb_SimulationBlock_Update>>
	>;
};

export type Omdb_Simulation = {
	__typename?: "omdb_Simulation";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_Simulation_QueryResult>;
	get?: Maybe<Simulation>;
	gets?: Maybe<Array<Maybe<Simulation>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_SimulationDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_Simulation_Input;
};

export type Omdb_SimulationFindArgs = {
	input: Omdb_Simulation_QueryResultInput;
};

export type Omdb_SimulationGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_SimulationGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_Simulation_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	jobIds?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	archived?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	scenarios?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	frequencies?: Maybe<Array<Maybe<Scalars["String"]>>>;
	periods?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modules?: Maybe<Array<Maybe<Scalars["String"]>>>;
	economies?: Maybe<Array<Maybe<Scalars["String"]>>>;
	variables?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	axes?: Maybe<Array<Maybe<Scalars["String"]>>>;
	status?: Maybe<Array<Maybe<Scalars["String"]>>>;
	gridName?: Maybe<Array<Maybe<Scalars["String"]>>>;
	path?: Maybe<Array<Maybe<Scalars["String"]>>>;
	dfsPath?: Maybe<Array<Maybe<Scalars["String"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	elements?: Maybe<Array<Maybe<Scalars["String"]>>>;
	size?: Maybe<Array<Maybe<Scalars["String"]>>>;
	sourceType?: Maybe<Array<Maybe<Scalars["String"]>>>;
	productVersion?: Maybe<Array<Maybe<Scalars["String"]>>>;
	userFile?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	deletedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	billingInformation?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	scenarioSummary?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type Omdb_Simulation_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	jobIds?: Maybe<Array<Scalars["ID"]>>;
	archived?: Maybe<Scalars["Boolean"]>;
	scenarios?: Maybe<Scalars["Int"]>;
	frequencies?: Maybe<Array<Scalars["String"]>>;
	periods?: Maybe<Omdb_Period_Insert>;
	modules?: Maybe<Array<Maybe<Scalars["String"]>>>;
	economies?: Maybe<Array<Maybe<Scalars["String"]>>>;
	variables?: Maybe<Scalars["Int"]>;
	axes?: Maybe<Array<Maybe<Scalars["String"]>>>;
	status?: Maybe<Scalars["String"]>;
	gridName?: Maybe<Scalars["String"]>;
	path?: Maybe<Scalars["String"]>;
	dfsPath?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	elements?: Maybe<Scalars["String"]>;
	size?: Maybe<Scalars["String"]>;
	sourceType?: Maybe<Scalars["String"]>;
	productVersion?: Maybe<Scalars["String"]>;
	userFile?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	deletedTime?: Maybe<Scalars["Date"]>;
	billingInformation?: Maybe<Omdb_SimulationBillingInfo_Insert>;
	scenarioSummary?: Maybe<Omdb_ScenarioSummary_Insert>;
};

export type Omdb_Simulation_Mutation = {
	__typename?: "omdb_Simulation_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<Simulation>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_Simulation_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Simulation_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_Simulation_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_Simulation_MutationInsertArgs = {
	values: Array<Maybe<Omdb_Simulation_Insert>>;
};

export type Omdb_Simulation_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_Simulation_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_Simulation_Update;
};

export type Omdb_Simulation_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_Simulation_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_Simulation_QueryResult = {
	__typename?: "omdb_Simulation_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<Simulation>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_Simulation_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_Simulation_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_Simulation_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	jobIds?: Maybe<Array<Scalars["ID"]>>;
	archived?: Maybe<Scalars["Boolean"]>;
	scenarios?: Maybe<Scalars["Int"]>;
	frequencies?: Maybe<Array<Scalars["String"]>>;
	periods?: Maybe<Omdb_Period_Update>;
	modules?: Maybe<Array<Maybe<Scalars["String"]>>>;
	economies?: Maybe<Array<Maybe<Scalars["String"]>>>;
	variables?: Maybe<Scalars["Int"]>;
	axes?: Maybe<Array<Maybe<Scalars["String"]>>>;
	status?: Maybe<Scalars["String"]>;
	gridName?: Maybe<Scalars["String"]>;
	path?: Maybe<Scalars["String"]>;
	dfsPath?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	elements?: Maybe<Scalars["String"]>;
	size?: Maybe<Scalars["String"]>;
	sourceType?: Maybe<Scalars["String"]>;
	productVersion?: Maybe<Scalars["String"]>;
	userFile?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	deletedTime?: Maybe<Scalars["Date"]>;
	billingInformation?: Maybe<Omdb_SimulationBillingInfo_Update>;
	scenarioSummary?: Maybe<Omdb_ScenarioSummary_Update>;
};

export type Omdb_SimulationBillingInfo_Insert = {
	windowsEC2InstanceType?: Maybe<Array<Scalars["String"]>>;
	linuxEC2InstanceType?: Maybe<Array<Scalars["String"]>>;
	linuxEC2InstanceQuantity?: Maybe<Scalars["Int"]>;
	windowsEC2InstanceQuantity?: Maybe<Scalars["Int"]>;
	startTime?: Maybe<Scalars["Int"]>;
	simulationWorkerEndTime?: Maybe<Scalars["Int"]>;
	compilationEndTime?: Maybe<Scalars["Int"]>;
	elements?: Maybe<Scalars["Float"]>;
};

export type Omdb_SimulationBillingInfo_Update = {
	windowsEC2InstanceType?: Maybe<Array<Scalars["String"]>>;
	linuxEC2InstanceType?: Maybe<Array<Scalars["String"]>>;
	linuxEC2InstanceQuantity?: Maybe<Scalars["Int"]>;
	windowsEC2InstanceQuantity?: Maybe<Scalars["Int"]>;
	startTime?: Maybe<Scalars["Int"]>;
	simulationWorkerEndTime?: Maybe<Scalars["Int"]>;
	compilationEndTime?: Maybe<Scalars["Int"]>;
	elements?: Maybe<Scalars["Float"]>;
};

export type Omdb_SimulationBlock_Insert = {
	index?: Maybe<Scalars["Int"]>;
	storageBlockNumber?: Maybe<Scalars["Int"]>;
	relativeIndex?: Maybe<Scalars["Int"]>;
};

export type Omdb_SimulationBlock_Update = {
	index?: Maybe<Scalars["Int"]>;
	storageBlockNumber?: Maybe<Scalars["Int"]>;
	relativeIndex?: Maybe<Scalars["Int"]>;
};

export type Omdb_SimulationSession = {
	__typename?: "omdb_SimulationSession";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_SimulationSession_QueryResult>;
	get?: Maybe<SimulationSession>;
	gets?: Maybe<Array<Maybe<SimulationSession>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_SimulationSessionDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_SimulationSession_Input;
};

export type Omdb_SimulationSessionFindArgs = {
	input: Omdb_SimulationSession_QueryResultInput;
};

export type Omdb_SimulationSessionGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_SimulationSessionGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_SimulationSession_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	simulation?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	endTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	querySessions?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_SimulationSession_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	simulation?: Maybe<Scalars["ID"]>;
	endTime?: Maybe<Scalars["Date"]>;
	querySessions?: Maybe<Array<Maybe<Omdb_QuerySession_Insert>>>;
	version?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_SimulationSession_Mutation = {
	__typename?: "omdb_SimulationSession_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<SimulationSession>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_SimulationSession_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_SimulationSession_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_SimulationSession_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_SimulationSession_MutationInsertArgs = {
	values: Array<Maybe<Omdb_SimulationSession_Insert>>;
};

export type Omdb_SimulationSession_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_SimulationSession_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_SimulationSession_Update;
};

export type Omdb_SimulationSession_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_SimulationSession_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_SimulationSession_QueryResult = {
	__typename?: "omdb_SimulationSession_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<SimulationSession>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_SimulationSession_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_SimulationSession_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_SimulationSession_Update = {
	_id?: Maybe<Scalars["ID"]>;
	simulation?: Maybe<Scalars["ID"]>;
	endTime?: Maybe<Scalars["Date"]>;
	querySessions?: Maybe<Array<Maybe<Omdb_QuerySession_Update>>>;
	version?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	createdTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_SingularAxisCoordinate_Insert = {
	axis: Scalars["String"];
	coordinate: Scalars["String"];
};

export type Omdb_SingularAxisCoordinate_Update = {
	axis?: Maybe<Scalars["String"]>;
	coordinate?: Maybe<Scalars["String"]>;
};

export type Omdb_StorageBlockScenario_Insert = {
	index?: Maybe<Scalars["Int"]>;
	scenarios?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type Omdb_StorageBlockScenario_Update = {
	index?: Maybe<Scalars["Int"]>;
	scenarios?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type Omdb_Tag = {
	__typename?: "omdb_tag";
	defaultValue?: Maybe<Scalars["String"]>;
	description?: Maybe<Scalars["String"]>;
	label?: Maybe<Scalars["String"]>;
	multiple?: Maybe<Scalars["Boolean"]>;
	name?: Maybe<Scalars["String"]>;
	required?: Maybe<Scalars["Boolean"]>;
	reserved?: Maybe<Scalars["Boolean"]>;
	type?: Maybe<Scalars["String"]>;
	ui?: Maybe<TagUiGraph>;
};

export type Omdb_Typed_Graph = {
	__typename?: "omdb_typed_graph";
	/** Wrapper for omdb type 'BillingAdditionalInformation' */
	billingAdditionalInformation?: Maybe<Omdb_BillingAdditionalInformation>;
	/** Wrapper for omdb type 'FileType' */
	fileType?: Maybe<Omdb_FileType>;
	/** Wrapper for omdb type 'Folder' */
	folder?: Maybe<Omdb_Folder>;
	/** Wrapper for omdb type 'FolderItem' */
	folderItem?: Maybe<Omdb_FolderItem>;
	/** Wrapper for omdb type 'GridStatus' */
	gridStatus?: Maybe<Omdb_GridStatus>;
	/** Wrapper for omdb type 'InvestmentOptimization' */
	investmentOptimization?: Maybe<Omdb_InvestmentOptimization>;
	/** Wrapper for omdb type 'InvestmentOptimizationSession' */
	investmentOptimizationSession?: Maybe<Omdb_InvestmentOptimizationSession>;
	/** Wrapper for omdb type 'Query' */
	query?: Maybe<Omdb_Query>;
	/** Wrapper for omdb type 'Report' */
	report?: Maybe<Omdb_Report>;
	/** Wrapper for omdb type 'S3File' */
	s3File?: Maybe<Omdb_S3File>;
	/** Wrapper for omdb type 'Simulation' */
	simulation?: Maybe<Omdb_Simulation>;
	/** Wrapper for omdb type 'SimulationSession' */
	simulationSession?: Maybe<Omdb_SimulationSession>;
	/** Wrapper for omdb type 'UserFile' */
	userFile?: Maybe<Omdb_UserFile>;
	/** Wrapper for omdb type 'UserTag' */
	userTag?: Maybe<Omdb_UserTag>;
	/** Wrapper for omdb type 'UserTagValue' */
	userTagValue?: Maybe<Omdb_UserTagValue>;
};

export type Omdb_Typed_Mutations = {
	__typename?: "omdb_typed_mutations";
	/** Mutations for 'BillingAdditionalInformation' */
	billingAdditionalInformation?: Maybe<
		Omdb_BillingAdditionalInformation_Mutation
	>;
	/** Mutations for 'FileType' */
	fileType?: Maybe<Omdb_FileType_Mutation>;
	/** Mutations for 'Folder' */
	folder?: Maybe<Omdb_Folder_Mutation>;
	/** Mutations for 'FolderItem' */
	folderItem?: Maybe<Omdb_FolderItem_Mutation>;
	/** Mutations for 'GridStatus' */
	gridStatus?: Maybe<Omdb_GridStatus_Mutation>;
	/** Mutations for 'InvestmentOptimization' */
	investmentOptimization?: Maybe<Omdb_InvestmentOptimization_Mutation>;
	/** Mutations for 'InvestmentOptimizationSession' */
	investmentOptimizationSession?: Maybe<
		Omdb_InvestmentOptimizationSession_Mutation
	>;
	/** Mutations for 'Query' */
	query?: Maybe<Omdb_Query_Mutation>;
	/** Mutations for 'Report' */
	report?: Maybe<Omdb_Report_Mutation>;
	/** Mutations for 'S3File' */
	s3File?: Maybe<Omdb_S3File_Mutation>;
	/** Mutations for 'Simulation' */
	simulation?: Maybe<Omdb_Simulation_Mutation>;
	/** Mutations for 'SimulationSession' */
	simulationSession?: Maybe<Omdb_SimulationSession_Mutation>;
	/** Mutations for 'UserFile' */
	userFile?: Maybe<Omdb_UserFile_Mutation>;
	/** Mutations for 'UserTag' */
	userTag?: Maybe<Omdb_UserTag_Mutation>;
	/** Mutations for 'UserTagValue' */
	userTagValue?: Maybe<Omdb_UserTagValue_Mutation>;
};

export type Omdb_Ui_Object = {
	__typename?: "omdb_ui_object";
	card?: Maybe<Scalars["Json"]>;
	catalog?: Maybe<Scalars["Json"]>;
	objectType?: Maybe<Scalars["String"]>;
	table?: Maybe<OmdbTableUiGraph>;
};

export type Omdb_Union =
	| ConningUser
	| JsonObjectGraph
	| UserTagValue
	| UserTag
	| Period
	| Simulation
	| ScenarioSummary
	| SimulationBlock
	| StorageBlockScenario
	| SimulationBillingInfo
	| Query
	| QueryBillingInfo
	| Arrangement
	| QueryResult
	| SingularAxisCoordinate
	| View
	| ViewRequirement
	| Report
	| QuerySession
	| SimulationSession
	| Ec2Instance
	| Job
	| GridStatus
	| S3File
	| FileType
	| FolderItem
	| Folder
	| InvestmentOptimization
	| UserFile
	| InvestmentOptimizationBillingInfo
	| UserSession
	| InvestmentOptimizationSession
	| BillingAdditionalInformation;

export type Omdb_UserFile = {
	__typename?: "omdb_UserFile";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_UserFile_QueryResult>;
	get?: Maybe<UserFile>;
	gets?: Maybe<Array<Maybe<UserFile>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_UserFileDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_UserFile_Input;
};

export type Omdb_UserFileFindArgs = {
	input: Omdb_UserFile_QueryResultInput;
};

export type Omdb_UserFileGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_UserFileGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_UserFile_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	type?: Maybe<Array<Maybe<Scalars["String"]>>>;
	status?: Maybe<Array<Maybe<Scalars["String"]>>>;
	version?: Maybe<Array<Maybe<Scalars["String"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	deletedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_UserFile_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	type: Scalars["String"];
	status?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	deletedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_UserFile_Mutation = {
	__typename?: "omdb_UserFile_mutation";
	addUserTagValue?: Maybe<Scalars["String"]>;
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<UserFile>>>;
	removeUserTagValue?: Maybe<Scalars["String"]>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
	updateUserTagValues?: Maybe<Omdb_Union>;
};

export type Omdb_UserFile_MutationAddUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_UserFile_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_UserFile_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_UserFile_MutationInsertArgs = {
	values: Array<Maybe<Omdb_UserFile_Insert>>;
};

export type Omdb_UserFile_MutationRemoveUserTagValueArgs = {
	id: Scalars["ID"];
	tagValueId: Scalars["ID"];
};

export type Omdb_UserFile_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_UserFile_Update;
};

export type Omdb_UserFile_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_UserFile_MutationUpdateUserTagValuesArgs = {
	id: Scalars["ID"];
	tagValueIds: Array<Scalars["ID"]>;
};

export type Omdb_UserFile_QueryResult = {
	__typename?: "omdb_UserFile_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<UserFile>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_UserFile_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_UserFile_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_UserFile_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	type?: Maybe<Scalars["String"]>;
	status?: Maybe<Scalars["String"]>;
	version?: Maybe<Scalars["String"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	deletedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_UserSession_Insert = {
	startTime?: Maybe<Scalars["Date"]>;
	endTime?: Maybe<Scalars["Date"]>;
	userId: Scalars["String"];
};

export type Omdb_UserSession_Update = {
	startTime?: Maybe<Scalars["Date"]>;
	endTime?: Maybe<Scalars["Date"]>;
	userId?: Maybe<Scalars["String"]>;
};

export type Omdb_UserTag = {
	__typename?: "omdb_UserTag";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_UserTag_QueryResult>;
	get?: Maybe<UserTag>;
	gets?: Maybe<Array<Maybe<UserTag>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_UserTagDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_UserTag_Input;
};

export type Omdb_UserTagFindArgs = {
	input: Omdb_UserTag_QueryResultInput;
};

export type Omdb_UserTagGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_UserTagGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_UserTag_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	name?: Maybe<Array<Maybe<Scalars["String"]>>>;
	objectTypes?: Maybe<Array<Maybe<Scalars["String"]>>>;
	multiple?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	label?: Maybe<Array<Maybe<Scalars["String"]>>>;
	hierarchy?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	values?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type Omdb_UserTag_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	name: Scalars["String"];
	objectTypes?: Maybe<Array<Scalars["String"]>>;
	multiple?: Maybe<Scalars["Boolean"]>;
	label?: Maybe<Scalars["String"]>;
	hierarchy?: Maybe<Scalars["Boolean"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_UserTag_Mutation = {
	__typename?: "omdb_UserTag_mutation";
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<UserTag>>>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
};

export type Omdb_UserTag_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_UserTag_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_UserTag_MutationInsertArgs = {
	values: Array<Maybe<Omdb_UserTag_Insert>>;
};

export type Omdb_UserTag_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_UserTag_Update;
};

export type Omdb_UserTag_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_UserTag_QueryResult = {
	__typename?: "omdb_UserTag_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<UserTag>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_UserTag_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_UserTag_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_UserTag_Update = {
	_id?: Maybe<Scalars["ID"]>;
	name?: Maybe<Scalars["String"]>;
	objectTypes?: Maybe<Array<Scalars["String"]>>;
	multiple?: Maybe<Scalars["Boolean"]>;
	label?: Maybe<Scalars["String"]>;
	hierarchy?: Maybe<Scalars["Boolean"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_UserTagValue = {
	__typename?: "omdb_UserTagValue";
	count?: Maybe<Scalars["Int"]>;
	distinct?: Maybe<OmdbDistinctResultGraph>;
	find?: Maybe<Omdb_UserTagValue_QueryResult>;
	get?: Maybe<UserTagValue>;
	gets?: Maybe<Array<Maybe<UserTagValue>>>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	/** UI Layout Information for a given object type */
	ui?: Maybe<Omdb_Ui_Object>;
};

export type Omdb_UserTagValueDistinctArgs = {
	tags: Array<Maybe<Scalars["String"]>>;
	searchText?: Maybe<Scalars["String"]>;
	where: Omdb_UserTagValue_Input;
};

export type Omdb_UserTagValueFindArgs = {
	input: Omdb_UserTagValue_QueryResultInput;
};

export type Omdb_UserTagValueGetArgs = {
	_id: Scalars["ID"];
};

export type Omdb_UserTagValueGetsArgs = {
	_ids: Array<Scalars["ID"]>;
};

export type Omdb_UserTagValue_Input = {
	_id?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	value?: Maybe<Array<Maybe<Scalars["String"]>>>;
	background?: Maybe<Array<Maybe<Scalars["String"]>>>;
	color?: Maybe<Array<Maybe<Scalars["String"]>>>;
	label?: Maybe<Array<Maybe<Scalars["String"]>>>;
	align?: Maybe<Array<Maybe<Scalars["String"]>>>;
	tag?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	order?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	isDefault?: Maybe<Array<Maybe<Scalars["Boolean"]>>>;
	modifiedBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdBy?: Maybe<Array<Maybe<Scalars["ID"]>>>;
	createdTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
	modifiedTime?: Maybe<Array<Maybe<Scalars["Date"]>>>;
};

export type Omdb_UserTagValue_Insert = {
	_id?: Maybe<Scalars["ID"]>;
	value: Scalars["String"];
	background?: Maybe<Scalars["String"]>;
	color?: Maybe<Scalars["String"]>;
	label?: Maybe<Scalars["String"]>;
	align?: Maybe<Scalars["String"]>;
	tag: Scalars["ID"];
	order?: Maybe<Scalars["Int"]>;
	isDefault?: Maybe<Scalars["Boolean"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_UserTagValue_Mutation = {
	__typename?: "omdb_UserTagValue_mutation";
	delete?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	expire?: Maybe<Scalars["Json"]>;
	insert?: Maybe<Array<Maybe<UserTagValue>>>;
	update?: Maybe<Scalars["Json"]>;
	updatePartial?: Maybe<Scalars["Json"]>;
};

export type Omdb_UserTagValue_MutationDeleteArgs = {
	id: Scalars["ObjectId"];
};

export type Omdb_UserTagValue_MutationExpireArgs = {
	id: Scalars["ID"];
};

export type Omdb_UserTagValue_MutationInsertArgs = {
	values: Array<Maybe<Omdb_UserTagValue_Insert>>;
};

export type Omdb_UserTagValue_MutationUpdateArgs = {
	id: Scalars["ID"];
	value: Omdb_UserTagValue_Update;
};

export type Omdb_UserTagValue_MutationUpdatePartialArgs = {
	id: Scalars["ID"];
	set: Scalars["Json"];
	reduce: Scalars["Boolean"];
};

export type Omdb_UserTagValue_QueryResult = {
	__typename?: "omdb_UserTagValue_queryResult";
	input?: Maybe<Omdb_QueryRun_Input>;
	results?: Maybe<Array<Maybe<UserTagValue>>>;
	resultsRaw?: Maybe<Array<Maybe<Scalars["Json"]>>>;
	skipped: Scalars["Int"];
	total: Scalars["Int"];
};

export type Omdb_UserTagValue_QueryResultInput = {
	/** The number of elements to skip */
	skip?: Maybe<Scalars["Int"]>;
	/** The maximum number of elements to retrieve */
	limit?: Maybe<Scalars["Int"]>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** Column to sort by */
	sortBy?: Maybe<Scalars["String"]>;
	/** asc or desc */
	sortOrder?: Maybe<Scalars["String"]>;
	/** {field1: value1). field2: value2 } */
	where?: Maybe<Omdb_UserTagValue_Input>;
	/** Searchable tags */
	searchTags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Favorite values to be ordered first in result */
	favorites?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Omdb_UserTagValue_Update = {
	_id?: Maybe<Scalars["ID"]>;
	value?: Maybe<Scalars["String"]>;
	background?: Maybe<Scalars["String"]>;
	color?: Maybe<Scalars["String"]>;
	label?: Maybe<Scalars["String"]>;
	align?: Maybe<Scalars["String"]>;
	tag?: Maybe<Scalars["ID"]>;
	order?: Maybe<Scalars["Int"]>;
	isDefault?: Maybe<Scalars["Boolean"]>;
	modifiedBy?: Maybe<Scalars["ID"]>;
	createdBy?: Maybe<Scalars["ID"]>;
	createdTime?: Maybe<Scalars["Date"]>;
	modifiedTime?: Maybe<Scalars["Date"]>;
};

export type Omdb_View_Insert = {
	name?: Maybe<Scalars["String"]>;
	description?: Maybe<Scalars["String"]>;
	available?: Maybe<Scalars["Boolean"]>;
	bootstrappable?: Maybe<Scalars["Boolean"]>;
	requirements?: Maybe<Array<Maybe<Omdb_ViewRequirement_Insert>>>;
};

export type Omdb_View_Update = {
	name?: Maybe<Scalars["String"]>;
	description?: Maybe<Scalars["String"]>;
	available?: Maybe<Scalars["Boolean"]>;
	bootstrappable?: Maybe<Scalars["Boolean"]>;
	requirements?: Maybe<Array<Maybe<Omdb_ViewRequirement_Update>>>;
};

export type Omdb_ViewRequirement_Insert = {
	met?: Maybe<Scalars["Boolean"]>;
	description?: Maybe<Scalars["String"]>;
};

export type Omdb_ViewRequirement_Update = {
	met?: Maybe<Scalars["Boolean"]>;
	description?: Maybe<Scalars["String"]>;
};

export type OmdbAdminMutationObjectGraph = {
	__typename?: "OmdbAdminMutationObjectGraph";
	bootstrapDatabase?: Maybe<Scalars["String"]>;
};

export type OmdbConfigGraph = {
	__typename?: "OmdbConfigGraph";
	db?: Maybe<Scalars["String"]>;
	server?: Maybe<Scalars["String"]>;
};

export type OmdbDistinctInput = {
	/** The object types to search */
	objectTypes: Array<Scalars["String"]>;
	/** The tags to select values for */
	tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
	/** Text to search for (case-insensitive) */
	searchText?: Maybe<Scalars["String"]>;
	/** {field1: value1, field2: value2 } */
	where?: Maybe<Scalars["Json"]>;
};

export type OmdbDistinctResultGraph = {
	__typename?: "OmdbDistinctResultGraph";
	input?: Maybe<DistinctTagValuesInput>;
	results?: Maybe<Array<Maybe<Omdb_Distinct_Untyped>>>;
};

export type OmdbObjectType = {
	__typename?: "OmdbObjectType";
	id?: Maybe<Scalars["String"]>;
	tags?: Maybe<Array<Maybe<Omdb_Tag>>>;
	ui?: Maybe<Omdb_Ui_Object>;
	userTags?: Maybe<Array<Maybe<UserTag>>>;
};

export type OmdbQuery = {
	__typename?: "OmdbQuery";
	config?: Maybe<OmdbConfigGraph>;
	objectType?: Maybe<OmdbObjectType>;
	objectTypes?: Maybe<Array<Maybe<OmdbObjectType>>>;
	raw?: Maybe<Omdb_Generic_Graph>;
	typed?: Maybe<Omdb_Typed_Graph>;
};

export type OmdbQueryObjectTypeArgs = {
	id: Scalars["String"];
};

export type OmdbQueryObjectTypesArgs = {
	ids: Array<Scalars["String"]>;
};

export type OmdbTableUiGraph = {
	__typename?: "OmdbTableUiGraph";
	columns?: Maybe<Scalars["Json"]>;
	frozenColumns?: Maybe<Scalars["Int"]>;
};

export type OmdbUpdateEventGraph = {
	__typename?: "OmdbUpdateEventGraph";
	_id: Scalars["String"];
	objectType: Scalars["String"];
	operation: Scalars["String"];
};

export type Period = {
	__typename?: "Period";
	eulerPeriod?: Maybe<Scalars["Int"]>;
	month?: Maybe<Scalars["Int"]>;
	quarter?: Maybe<Scalars["Int"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
	year?: Maybe<Scalars["Int"]>;
};

export type Query = DbObject &
	Ui & {
		__typename?: "Query";
		_id: Scalars["ID"];
		archived?: Maybe<Scalars["Boolean"]>;
		billingInformation?: Maybe<QueryBillingInfo>;
		createdBy?: Maybe<ConningUser>;
		createdTime?: Maybe<Scalars["Date"]>;
		frequencies?: Maybe<Array<Scalars["String"]>>;
		hasResult?: Maybe<Scalars["Boolean"]>;
		modifiedBy?: Maybe<ConningUser>;
		modifiedTime?: Maybe<Scalars["Date"]>;
		name: Scalars["String"];
		periods?: Maybe<Period>;
		querySave?: Maybe<Scalars["Json"]>;
		result?: Maybe<QueryResult>;
		scenarios?: Maybe<Scalars["Int"]>;
		simulations: Array<Simulation>;
		userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
		variables?: Maybe<Scalars["Int"]>;
		version?: Maybe<Scalars["String"]>;
	};

export type QueryBillingInfo = {
	__typename?: "QueryBillingInfo";
	sessionEndTime?: Maybe<Scalars["Date"]>;
	sessionStartTime?: Maybe<Scalars["Date"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type QueryResult = {
	__typename?: "QueryResult";
	availableViews?: Maybe<Array<Maybe<View>>>;
	default_arrangement?: Maybe<Arrangement>;
	name?: Maybe<Scalars["String"]>;
	ready?: Maybe<Scalars["Boolean"]>;
	shape?: Maybe<Array<Scalars["Int"]>>;
	singularAxisCoordinate?: Maybe<Array<Maybe<SingularAxisCoordinate>>>;
	userOptions?: Maybe<Scalars["Json"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type QuerySession = {
	__typename?: "QuerySession";
	queryId?: Maybe<Scalars["String"]>;
	startTime?: Maybe<Scalars["Date"]>;
	userId?: Maybe<ConningUser>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type QuerySessionMutationGraph = {
	__typename?: "QuerySessionMutationGraph";
	runQuery?: Maybe<Scalars["String"]>;
	selectAxisValue?: Maybe<Scalars["String"]>;
};

export type QueryToolMutationGraph = {
	__typename?: "QueryToolMutationGraph";
	querySession?: Maybe<QuerySessionMutationGraph>;
	startQuerySession?: Maybe<StartQuerySessionResult>;
};

export type QueryToolMutationGraphQuerySessionArgs = {
	id: Scalars["String"];
};

export type QueryToolMutationGraphStartQuerySessionArgs = {
	simulationIds: Array<Scalars["String"]>;
};

export type Report = DbObject &
	Ui & {
		__typename?: "Report";
		_id: Scalars["ID"];
		createdBy?: Maybe<ConningUser>;
		createdTime?: Maybe<Scalars["Date"]>;
		modifiedBy?: Maybe<ConningUser>;
		modifiedTime?: Maybe<Scalars["Date"]>;
		name: Scalars["String"];
		reportItems?: Maybe<Array<Scalars["Json"]>>;
		userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
		version?: Maybe<Scalars["String"]>;
	};

export type S3File = DbObject & {
	__typename?: "S3File";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	defaultName?: Maybe<Scalars["String"]>;
	for?: Maybe<ConningUser>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	s3Key: Scalars["ID"];
	type?: Maybe<FileType>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type ScenarioSummary = {
	__typename?: "ScenarioSummary";
	actualStorageBlockBySimulationBlock?: Maybe<Array<Maybe<SimulationBlock>>>;
	numberScenariosPerSimulationBlock?: Maybe<Scalars["Int"]>;
	relativeIndicesByScenario?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	scenariosByStorageBlock?: Maybe<Array<Maybe<StorageBlockScenario>>>;
	storageBlockByScenario?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	storageBlocks?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	targetStorageBlockBySimulationBlock?: Maybe<Array<Maybe<SimulationBlock>>>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type SendToKInput = {
	action?: Maybe<Scalars["String"]>;
	extra?: Maybe<Scalars["Json"]>;
};

export type SentNotificationType = {
	__typename?: "SentNotificationType";
	_id?: Maybe<Scalars["ObjectId"]>;
	delivered?: Maybe<Scalars["Boolean"]>;
	endpoint?: Maybe<Scalars["Json"]>;
	messageKey: Scalars["String"];
	owner: Scalars["String"];
	sentTime: Scalars["Date"];
	title: Scalars["String"];
};

export type Simulation = DbObject &
	Ui & {
		__typename?: "Simulation";
		_id: Scalars["ID"];
		archived?: Maybe<Scalars["Boolean"]>;
		axes?: Maybe<Array<Maybe<Scalars["String"]>>>;
		billingInformation?: Maybe<SimulationBillingInfo>;
		createdBy?: Maybe<ConningUser>;
		createdTime?: Maybe<Scalars["Date"]>;
		deletedTime?: Maybe<Scalars["Date"]>;
		dfsPath?: Maybe<Scalars["String"]>;
		economies?: Maybe<Array<Maybe<Scalars["String"]>>>;
		elements?: Maybe<Scalars["String"]>;
		frequencies?: Maybe<Array<Scalars["String"]>>;
		gridName?: Maybe<Scalars["String"]>;
		jobIds?: Maybe<Array<Scalars["ID"]>>;
		modifiedBy?: Maybe<ConningUser>;
		modifiedTime?: Maybe<Scalars["Date"]>;
		modules?: Maybe<Array<Maybe<Scalars["String"]>>>;
		name: Scalars["String"];
		path?: Maybe<Scalars["String"]>;
		periods?: Maybe<Period>;
		productVersion?: Maybe<Scalars["String"]>;
		scenarios?: Maybe<Scalars["Int"]>;
		scenarioSummary?: Maybe<ScenarioSummary>;
		size?: Maybe<Scalars["String"]>;
		sourceType?: Maybe<Scalars["String"]>;
		status?: Maybe<Scalars["String"]>;
		userFile?: Maybe<Scalars["ID"]>;
		userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
		variables?: Maybe<Scalars["Int"]>;
		version?: Maybe<Scalars["String"]>;
	};

export type SimulationBillingInfo = {
	__typename?: "SimulationBillingInfo";
	compilationEndTime?: Maybe<Scalars["Int"]>;
	elements?: Maybe<Scalars["Float"]>;
	linuxEC2InstanceQuantity?: Maybe<Scalars["Int"]>;
	linuxEC2InstanceType?: Maybe<Array<Scalars["String"]>>;
	simulationWorkerEndTime?: Maybe<Scalars["Int"]>;
	startTime?: Maybe<Scalars["Int"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
	windowsEC2InstanceQuantity?: Maybe<Scalars["Int"]>;
	windowsEC2InstanceType?: Maybe<Array<Scalars["String"]>>;
};

export type SimulationBlock = {
	__typename?: "SimulationBlock";
	index?: Maybe<Scalars["Int"]>;
	relativeIndex?: Maybe<Scalars["Int"]>;
	storageBlockNumber?: Maybe<Scalars["Int"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type SimulationSession = DbObject & {
	__typename?: "SimulationSession";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	endTime?: Maybe<Scalars["Date"]>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	querySessions?: Maybe<Array<Maybe<QuerySession>>>;
	simulation?: Maybe<Simulation>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
	version?: Maybe<Scalars["String"]>;
};

export type SingularAxisCoordinate = {
	__typename?: "SingularAxisCoordinate";
	axis: Scalars["String"];
	coordinate: Scalars["String"];
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type StartQuerySessionResult = {
	__typename?: "StartQuerySessionResult";
	tbd?: Maybe<Scalars["String"]>;
};

export type StorageBlockScenario = {
	__typename?: "StorageBlockScenario";
	index?: Maybe<Scalars["Int"]>;
	scenarios?: Maybe<Array<Maybe<Scalars["Int"]>>>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type TagUiGraph = {
	__typename?: "TagUiGraph";
	catalog?: Maybe<TagUiGraph_Catalog>;
	table?: Maybe<TagUiGraph_Table>;
};

export type TagUiGraph_Catalog = {
	__typename?: "TagUiGraph_Catalog";
	index?: Maybe<Scalars["Int"]>;
};

export type TagUiGraph_Table = {
	__typename?: "TagUiGraph_Table";
	index?: Maybe<Scalars["Int"]>;
	props?: Maybe<Scalars["Json"]>;
};

export type TestNotificationSubscriptionMutation = {
	__typename?: "TestNotificationSubscriptionMutation";
	sendTestDesktopNotification?: Maybe<DesktopNotification>;
	sendTestEmail?: Maybe<Scalars["String"]>;
	sendTestText?: Maybe<Scalars["String"]>;
};

export type Ui = {
	__typename?: "UI";
	name: Scalars["String"];
};

export type UserFile = DbObject &
	Ui & {
		__typename?: "UserFile";
		_id: Scalars["ID"];
		createdBy?: Maybe<ConningUser>;
		createdTime?: Maybe<Scalars["Date"]>;
		deletedTime?: Maybe<Scalars["Date"]>;
		modifiedBy?: Maybe<ConningUser>;
		modifiedTime?: Maybe<Scalars["Date"]>;
		name: Scalars["String"];
		status?: Maybe<Scalars["String"]>;
		type: Scalars["String"];
		userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
		version?: Maybe<Scalars["String"]>;
	};

export type UserQuery = {
	__typename?: "UserQuery";
	find?: Maybe<UserQueryResultGraph>;
	get?: Maybe<ConningUser>;
};

export type UserQueryFindArgs = {
	id: Scalars["ID"];
	page: Scalars["Int"];
	perPage: Scalars["Int"];
	sortBy: Scalars["String"];
	sortOrder: Scalars["String"];
};

export type UserQueryGetArgs = {
	id: Scalars["ID"];
};

export type UserQueryResultGraph = {
	__typename?: "UserQueryResultGraph";
	page?: Maybe<Scalars["Int"]>;
	perPage?: Maybe<Scalars["Int"]>;
	sortBy?: Maybe<Scalars["String"]>;
	sortOrder?: Maybe<Scalars["String"]>;
	users?: Maybe<Array<Maybe<ConningUser>>>;
};

export type UserSession = {
	__typename?: "UserSession";
	endTime?: Maybe<Scalars["Date"]>;
	startTime?: Maybe<Scalars["Date"]>;
	userId: Scalars["String"];
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type UserTag = DbObject & {
	__typename?: "UserTag";
	_id: Scalars["ID"];
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	hierarchy?: Maybe<Scalars["Boolean"]>;
	label?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	multiple?: Maybe<Scalars["Boolean"]>;
	name: Scalars["String"];
	objectTypes?: Maybe<Array<Scalars["String"]>>;
	values?: Maybe<Array<UserTagValue>>;
};

export type UserTagValue = DbObject & {
	__typename?: "UserTagValue";
	_id: Scalars["ID"];
	align?: Maybe<Scalars["String"]>;
	background?: Maybe<Scalars["String"]>;
	color?: Maybe<Scalars["String"]>;
	createdBy?: Maybe<ConningUser>;
	createdTime?: Maybe<Scalars["Date"]>;
	label?: Maybe<Scalars["String"]>;
	modifiedBy?: Maybe<ConningUser>;
	modifiedTime?: Maybe<Scalars["Date"]>;
	tag: UserTag;
	value: Scalars["String"];
};

export type View = {
	__typename?: "View";
	available?: Maybe<Scalars["Boolean"]>;
	bootstrappable?: Maybe<Scalars["Boolean"]>;
	description?: Maybe<Scalars["String"]>;
	name?: Maybe<Scalars["String"]>;
	requirements?: Maybe<Array<Maybe<ViewRequirement>>>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};

export type ViewRequirement = {
	__typename?: "ViewRequirement";
	description?: Maybe<Scalars["String"]>;
	met?: Maybe<Scalars["Boolean"]>;
	userTagValues?: Maybe<Array<Maybe<UserTagValue>>>;
};
export type RunBillingReportQueryVariables = {
	startDate: Scalars["Date"];
	endDate: Scalars["Date"];
	userIds?: Maybe<Array<Scalars["String"]>>;
	applications?: Maybe<Array<Scalars["String"]>>;
};

export type RunBillingReportQuery = { __typename?: "GraphQuery" } & {
	billing: Maybe<
		{ __typename?: "BillingQueryGraph" } & {
			report: Maybe<
				{ __typename?: "BillingReportSummaryGraph" } & Pick<
					BillingReportSummaryGraph,
					"startDate" | "endDate"
				> & {
						simulationSummary: Maybe<
							{ __typename?: "BillingSummaryGraph" } & {
								total: Maybe<
									{
										__typename?: "BillingBaseRowGraph";
									} & Pick<
										BillingBaseRowGraph,
										| "chargeType"
										| "computationCharge"
										| "dataElements"
										| "dataServingCharge"
										| "dataStorageCharge"
										| "totalCharge"
										| "ongoingDataStorageChargePerDay"
										| "hasDataServingCharge"
										| "hasDataStorageCharge"
									>
								>;
								billingJobRows: Maybe<
									Array<
										Maybe<
											{
												__typename?: "BillingJobGraph";
											} & {
												additionalInformation: Maybe<
													{
														__typename?: "BillingAdditionalInformation";
													} & Pick<
														BillingAdditionalInformation,
														| "_id"
														| "name"
														| "gridName"
													> & {
															createdBy: {
																__typename?: "ConningUser";
															} & Pick<
															ConningUser,
																"_id"
															>;
														}
												>;
												total: Maybe<
													{
														__typename?: "BillingBaseRowGraph";
													} & Pick<
														BillingBaseRowGraph,
														| "chargeType"
														| "computationCharge"
														| "dataElements"
														| "dataServingCharge"
														| "dataServingChargePerHour"
														| "dataStorageCharge"
														| "dataStorageChargePerDay"
														| "ongoingDataStorageChargePerDay"
														| "duration"
														| "finishDateTime"
														| "startDateTime"
														| "instanceType"
														| "totalCharge"
														| "maximumVCPUs"
														| "totalCPUTime"
														| "hasDataServingCharge"
														| "hasDataStorageCharge"
														| "flags"
													> & {
															user: Maybe<
																{
																	__typename?: "ConningUser";
																} & Pick<
																ConningUser,
																	"fullName"
																>
															>;
														}
												>;
												details: Maybe<
													Array<
														Maybe<
															{
																__typename?: "BillingBaseRowGraph";
															} & Pick<
																BillingBaseRowGraph,
																| "chargeType"
																| "computationCharge"
																| "dataElements"
																| "dataServingCharge"
																| "dataServingChargePerHour"
																| "dataStorageCharge"
																| "dataStorageChargePerDay"
																| "ongoingDataStorageChargePerDay"
																| "duration"
																| "finishDateTime"
																| "startDateTime"
																| "instanceType"
																| "totalCharge"
																| "maximumVCPUs"
																| "totalCPUTime"
																| "hasDataServingCharge"
																| "hasDataStorageCharge"
																| "flags"
															> & {
																	user: Maybe<
																		{
																			__typename?: "ConningUser";
																		} & Pick<
																		ConningUser,
																			"fullName"
																		>
																	>;
																}
														>
													>
												>;
											}
										>
									>
								>;
							}
						>;
					}
			>;
		}
	>;
};
