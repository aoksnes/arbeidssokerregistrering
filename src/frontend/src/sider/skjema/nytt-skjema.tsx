import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AVBRYT_PATH, SKJEMA_PATH } from '../../utils/konstanter';
import { AppState } from '../../reducer';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { endreSvarAction } from '../../ducks/svar';
import GeneriskSkjema from './generisk-skjema';

interface StateProps {
    sporsmalErBesvart: (sporsmalId: string) => boolean;
    hentAvgittSvar: (sporsmalId: string) => number | undefined;
}

interface DispatchProps {
    endreSvar: (sporsmalId: string, svar: number) => void;
}

interface SkjemaProps {
    children: {};
}

export interface MatchProps {
    id: string;
}

type Props = StateProps & DispatchProps & InjectedIntlProps & SkjemaProps & RouteComponentProps<MatchProps>;

class NyttSkjema extends React.Component<Props> {

    gjeldendeSporsmal: number;

    constructor(props: Props) {
        super(props);
        this.gjeldendeSporsmal = parseInt(props.match.params.id, 10);
    }

    render() {
        const fellesProps = {
            endreSvar: (sporsmalId, svar) => this.props.endreSvar(sporsmalId, svar),
            intl: this.props.intl,
            hentAvgittSvar: this.props.hentAvgittSvar
        };

        return (
            <GeneriskSkjema>
                
            </GeneriskSkjema>
        );
    }

    avbrytSkjema() {
        this.props.history.push(`${AVBRYT_PATH}`);
    }

    gaaTilNesteSporsmal() {
        this.gaaTilSporsmal(this.gjeldendeSporsmal + 1);
    }

    gaaTilSporsmal(sporsmal: number) {
        this.props.history.push(`${SKJEMA_PATH}/${sporsmal}`);
        this.gjeldendeSporsmal = sporsmal;
    }

    erAlleSporsmalBesvart() {
        // implementer
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    sporsmalErBesvart: (sporsmalId) => !!state.svar[sporsmalId],
    hentAvgittSvar: (sporsmalId) => state.svar[sporsmalId]
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    endreSvar: (sporsmalId, alternativId) => dispatch(endreSvarAction(sporsmalId, alternativId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NyttSkjema));