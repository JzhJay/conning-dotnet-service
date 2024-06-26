import { action, computed, observable, override, runInAction, makeObservable } from 'mobx';
import {Book} from '../../book/Book';
import {BookPage} from '../../book/BookPage';
import {ApiView} from '../../book/model';
import {IO, IOStatus} from '../IO';
import {ioStore} from '../IOStore';
import type {IOViewName} from '../models';
import {IOView} from './IOView';


export class IOPage extends BookPage<IOView> {
	constructor(book: Book, private io: IO, page) {
        super(book, page);

        makeObservable(this);

        this.additionalControls != "" && this.loadIOPageOptions(JSON.parse(this.additionalControls));

        this.showPageTitle = true;
        this.showViewCaption = false;
    }

	@observable showHoverPoint: boolean             = true;
	@observable isMonitorPage: boolean              = false;
	@observable showPreOptimizationStatus: boolean  = false;

	hoverViewId: string = null;

	@computed get plotExtremes() {
		return this.selectedViews.map(v => (v as IOView).plotExtremes).filter(e => e != null);
	}

	_viewUserOptionsCache = {};
	getViewUserOptions(id: string) {
		let userOptions = this._userOptions[id];

		if (userOptions.shouldInheritData) {
			let inheritKeys = ["showEfficientFrontier", "showLambdaPoints", "showAdditionalPoints"].concat(this.getView(id).name === "strategySummary" ? ['showDuration','showAssetClass','showTotal','showMetrics', 'rowOrder'] : []);
			let inheritFrom = this.selectedViews.find(v => v.id != id && this._userOptions[v.id] && !this._userOptions[v.id].shouldInheritData);

			if (inheritFrom)
				userOptions = Object.assign({}, userOptions, _.pick(this._userOptions[inheritFrom.id], inheritKeys));
			else
				userOptions = Object.assign({}, userOptions, _.pick(ioStore.defaultUserOptions(this.selectedViews.find(v => v.id == id).name as IOViewName), inheritKeys));

			if (inheritFrom && inheritFrom.name == "status")
				userOptions.showAdditionalPoints = true;

			// Return cached copy if identical to avoid needless re-renders from a failed object equality check in React/MobX.
			if (_.isEqual(this._viewUserOptionsCache[id], userOptions))
				userOptions = this._viewUserOptionsCache[id];

			this._viewUserOptionsCache[id] = userOptions;
		}

		return userOptions;
	}

	@override updateUserOptions(id: string, userOptions) {
		super.updateUserOptions(id, userOptions);
		this._viewUserOptionsCache[id] = null; // Always invalidate cache when a view is updated to ensure re-render;
	}

	@action asyncUpdateUserOptions = async (id: string, userOptions) => {
		let view = this.getView(id);
		this._viewUserOptionsCache[id] = null; // Always invalidate cache when a view is updated to ensure re-render;
		view.userOptions = userOptions;

		if (this.selectedViews.length > 0)
			await this.io.sendPageUpdate([{index: this.pageNumber, views: [{index: this.selectedViews.indexOf(view as IOView), controls: JSON.stringify(userOptions)}] }]);
	}

	allowShowHover(id) {
		// Can only show hover if charts have matching dataset
		return this.showHoverPoint && this.getViewUserOptions(this.hoverViewId).showEfficientFrontier == this.getViewUserOptions(id).showEfficientFrontier;
	}

	@override get pageOptions() {
		return {
			hoverPoint: this.showHoverPoint,
			showViewToolbars: this.showViewToolbars,
			showPageTitle: this.showPageTitle,
			scrollMode: this.scrollMode,
			isMonitorPage: this.isMonitorPage,
			showViewCaption: this.showViewCaption
		};
	}

	createView(name: string, view?: ApiView) {
		return new IOView(this.book, name as IOViewName, view != null ? (view.controls && view.controls != "" ? JSON.parse(view.controls) : null) : null);
	}

	@action loadIOPageOptions(state: { hoverPoint: boolean, showViewToolbars: boolean, scrollMode: boolean, showPageTitle: boolean, isMonitorPage: boolean}) {
		state.hoverPoint != null && (this.showHoverPoint = state.hoverPoint);
		this.showViewToolbars = state.showViewToolbars;
		state.showPageTitle != null && (this.showPageTitle = state.showPageTitle);
		state.scrollMode != null && (this.scrollMode = state.scrollMode);
		state.isMonitorPage != null && (this.isMonitorPage = state.isMonitorPage);
	}

	async afterInsertView(name = '') {
		// Trigger percentile update to pick up default percentiles from new view
		if (name == "ioBox") {
			await this.io.updatePercentiles();
		} else if (name == "strategySummary") {
			await this.io.updatePercentiles();
			await this.io.updateCtes();
		}
	}

	// Old functionality used only in testing
	@action toggleViewSelection(name: IOViewName) {
		if (!this.io.isLoading)
			this.io.viewAnimationInProgress = true;

		// Update in setTimeout to give view a chance to perform any pre animation rendering. e.g. animation loader in EF chart.
		return new Promise<void>( (resolve) => setTimeout(() => {
			runInAction(async () => {
				let {selectedViews} = this;
				let index = selectedViews.findIndex(v => v.name == name);
				let views = [];

				if (index == -1) {
					selectedViews.push(new IOView(this.book, name));
					views = [{view: name, newIndex: selectedViews.length - 1}];
				}
				else {
					views = [{index:index, newIndex: -1}]
					selectedViews.splice(index, 1);
				}

				await this.io.sendPageUpdate([{index: this.pageNumber, views: views}] );
				resolve();
			})
		}))
	}

	viewHasData(id) {
		const {io} = this;
		const userOptions = this.getViewUserOptions(id);
		const view = this.getView(id);
		let hasData = false;
		const isDominanceView = view.name == "pathWiseDominance" || view.name == "statisticalDominance";

		if (ioStore.views[view.name].isInput) {
			hasData = true;
		}
		else if (io.hasData && io.updateCount > 0) { // UpdateCount is used here to trigger re-calculation.
			if (userOptions.showEfficientFrontier) {
				if (io.isAdditionalAllocationsOnly) {
					hasData = true;
				}
				else if (this.io.frontierPoints) {
					const { frontierPointEvaluations } = io;
					if (frontierPointEvaluations.length > 0) {
						hasData = _.every(frontierPointEvaluations.map(e => e.evaluationNumber), io.evaluationHasDetails);
					}
				}
			} else {
				if (io.lambda) {
					hasData = io.lambda != null && io.lambda.length > 0; //_.every(this.lambda.map(l => l.bestEvaluationIndex), this.evaluationHasDetails);

					if (view.name == "efficientFrontier" && io.status == IOStatus.complete)
						hasData = _.every(io.lambda.map(l => l.bestEvaluationIndex).filter(evalIndex => evalIndex != -1), (evalIndex) => io.evaluationHasDetails(evalIndex) && io.evaluations[evalIndex].reward != null);
				}
			}

			if (hasData && userOptions.showAdditionalPoints) {
				if (io.additionalPoints.length > 0) {
					const { additionalPointEvaluations } = io;
					hasData = additionalPointEvaluations.length > 0 ? _.every(io.additionalPointEvaluations.map(e => e.evaluationNumber), io.evaluationHasDetails) : false;
				}
			}
			/*
			if (isDominanceView) {
				hasData = _.every(this.dominanceKeys(userOptions), (key) => this.evaluationDifferences[key]);
			}*/
		}

		return hasData;
	}

	@computed get canShowHoverPoint() : boolean {
		return this.showHoverPoint && this.selectedViews.find(view => view.name == "efficientFrontier") != null;
	}
}
