import { fetchToJson, fetchWithTimeout } from './api-utils';
import { Data as RegistrerBrukerData } from './registrerbruker';
import { backendToggle, getRegistreringBackendUrl, Data as FeatureTogglesData } from './feature-toggles';

export const INNLOGGINGSINFO_URL = '/innloggingslinje/auth';
export const AUTENTISERINGSINFO_URL = '/veilarbstepup/status';
export const SBLARBEID_URL = '/sbl/nav_security_check?goto=/sbl/arbeid/endreCv';
export const DITTNAV_URL = '/dittnav/';
export const FORSIDENAV_URL = 'https://www.nav.no/';
export const VEIENTILARBEID_URL = '/veientilarbeid/';
export const VEIENTILARBEID_MED_DAGPENGER_URL = '/veientilarbeid/?visInformasjonsmodul=true&visdagpenger=true';
export const ARBEIDSSOKERREGISTRERING_START = '/arbeidssokerregistrering/start';
export const VEILARBSTEPUP = `/veilarbstepup/oidc?url=${ARBEIDSSOKERREGISTRERING_START}`;
export const SBLARBEID_OPPRETT_MIN_ID_URL = '/sbl/nav_security_check?goto=/sbl/arbeid/opprettMinIdBruker';
export const VEILARBOPPFOLGINGPROXY_URL = '/veilarboppfolgingproxy/api';
export const VEILARBREGISTRERING_URL = '/veilarbregistrering/api';
export const FEATURE_URL = '/feature';

const VEILARBOPPFOLGINGPROXY_ME_URL = '/veilarboppfolgingproxy/api/oppfolging/me';
const PAM_JANZZ_URL = '/pam-janzz/rest';
const STYRK_URL = `${PAM_JANZZ_URL}/typeahead/yrke-med-styrk08`;

export const getCookie = name => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

function getHeaders() {
    return new Headers({
        'Content-Type': 'application/json',
        'NAV_CSRF_PROTECTION': getCookie('NAV_CSRF_PROTECTION'), // eslint-disable-line quote-props
    });
}

const MED_CREDENTIALS = {
    credentials: ('same-origin' as RequestCredentials)
};

export function hentRegistreringStatus(featureToggles: FeatureTogglesData) {
    return fetchToJson({
        url: `${getRegistreringBackendUrl(featureToggles)}/startregistrering`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        }
    });
}

export function registrerBruker(data: RegistrerBrukerData, featureToggles: FeatureTogglesData) {
    return fetchToJson({
        url: `${getRegistreringBackendUrl(featureToggles)}/startregistrering`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
            method: 'post',
            body: JSON.stringify(data)}
    });
}

const sblOpprettMinIdConfig = {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {'pragma': 'no-cache', 'cache-control': 'no-cache'}
};

export function registrerBrukerSBLArbeid(timeoutMillis?: number) {
    return timeoutMillis ?
        fetchWithTimeout(SBLARBEID_OPPRETT_MIN_ID_URL, timeoutMillis, (sblOpprettMinIdConfig as RequestInit)) :
        fetch(SBLARBEID_OPPRETT_MIN_ID_URL, (sblOpprettMinIdConfig as RequestInit));
}

export function hentInnloggingsInfo() {
    return fetchToJson({
        url: `${INNLOGGINGSINFO_URL}?randomness=${Math.random()}`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        }
    });
}

export function hentAutentiseringsInfo() {
    return fetchToJson({
        url: `${AUTENTISERINGSINFO_URL}`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        }
    });
}

export function hentBrukerInfo() {
    return fetchToJson({
        url: `${VEILARBOPPFOLGINGPROXY_ME_URL}`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        }
    });
}

export function hentStyrkkodeForSisteStillingFraAAReg(featureToggles: FeatureTogglesData) {
    return fetchToJson({
        url: `${getRegistreringBackendUrl(featureToggles)}/sistearbeidsforhold`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        },
        recoverWith: () => ({arbeidsgiver: null, stilling: null, styrk: null, fra: null, til: null})
    });
}

export function hentStillingFraPamGittStyrkkode(styrk: string) {
    return fetchToJson({
        url: `${PAM_JANZZ_URL}/kryssklassifiserMedKonsept?kodeForOversetting=${styrk}`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        },
        recoverWith: () => ({konseptMedStyrk08List: []})
    });
}

export function hentStillingMedStyrk08(sokestreng: string) {
    return fetchToJson({
        url: `${STYRK_URL}?q=${sokestreng}`,
        config: {...{redirect: 'manual'},
            headers: getHeaders()
        },
        recoverWith: () => ({'typeaheadYrkeList': []})
    });
}

export function hentFeatureToggles() {
    return fetchToJson({
        url: `${FEATURE_URL}/?feature=${backendToggle}`,
        config: { ...MED_CREDENTIALS,
            headers: getHeaders(),
        },
        recoverWith: () => ({})
    });
}