import * as Api from './api';
import { doThenDispatch, STATUS } from './api-utils';
import { AppState } from '../reducer';

export enum ActionTypes {
    FEATURE_TOGGLES_PENDING = 'FEATURE_TOGGLES_PENDING',
    FEATURE_TOGGLES_OK = 'FEATURE_TOGGLES_OK',
    FEATURE_TOGGLES_FEILET = 'FEATURE_TOGGLES_FEILET',
}

export interface Data {
    'arbeidssokerregistrering.bruk-ny-registrering': boolean;
    'arbeidssokerregistrering.gradual-rollout-ny-registrering': boolean;
}

export interface State {
    data: Data;
    status: string;
}

interface Action {
    type: ActionTypes;
    data: Data;
}

export const alleFeatureToggles = [
    'arbeidssokerregistrering.bruk-ny-registrering',
    'arbeidssokerregistrering.gradual-rollout-ny-registrering',
];

const initialState = {
    data : {
        'arbeidssokerregistrering.bruk-ny-registrering': false,
        'arbeidssokerregistrering.gradual-rollout-ny-registrering': false,
    },
    status: STATUS.NOT_STARTED
};

export default function (state: State = initialState, action: Action): State {
    switch (action.type) {
        case ActionTypes.FEATURE_TOGGLES_PENDING:
            if (state.status === STATUS.OK) {
                return { ...state, status: STATUS.RELOADING };
            }
            return { ...state, status: STATUS.PENDING };
        case ActionTypes.FEATURE_TOGGLES_FEILET:
            return { ...state, status: STATUS.ERROR };
        case ActionTypes.FEATURE_TOGGLES_OK: {
            return { ...state, status: STATUS.OK, data: action.data};
        }
        default:
            return state;
    }
}

export function hentFeatureToggles() {
    return doThenDispatch(() => Api.hentFeatureToggles(), {
        PENDING: ActionTypes.FEATURE_TOGGLES_PENDING,
        OK : ActionTypes.FEATURE_TOGGLES_OK,
        FEILET: ActionTypes.FEATURE_TOGGLES_FEILET,
    });
}

export function selectFeatureToggles(state: AppState): Data {
    return state.featureToggles.data;
}

export function selectBrukNyRegistreringFeatureToggle(state: AppState): boolean {
    return state.featureToggles.data['arbeidssokerregistrering.bruk-ny-registrering'];
}

export function selectGradualRolloutNyRegistreringFeatureToggle(state: AppState): boolean {
    return state.featureToggles.data['arbeidssokerregistrering.gradual-rollout-ny-registrering'];
}
