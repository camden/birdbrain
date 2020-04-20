import React, { useState, CSSProperties } from 'react';
import {
  ResistanceGameState,
  ResistanceMissionVote,
} from '@server/store/games/the-resistance/types';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstAckMissionVoteResults } from '@server/store/games/the-resistance/actions';
import Button from 'components/shared/button/Button';
import WaitingMessage from 'components/shared/WaitingMessage';
import styles from './ShowMissionVotingResults.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';
import cx from 'classnames';
import { prop } from 'ramda';

const ANIMATION_DELAY_MULTIPLIER_MS = 600;

export interface ResistanceProps {
  game: ResistanceGameState;
}

export interface VoteResultCardProps {
  vote: ResistanceMissionVote;
  index: number;
}

const VoteResultCard: React.FC<VoteResultCardProps> = ({ vote, index }) => {
  const success = vote === ResistanceMissionVote.SUCCESS;

  const style = {
    '--appear-delay': `${(index + 1) * ANIMATION_DELAY_MULTIPLIER_MS}ms`,
  } as CSSProperties;

  return (
    <div
      className={cx(styles.vote_result_card, {
        [styles.vote_result_card_success]: success,
        [styles.vote_result_card_fail]: !success,
      })}
      style={style}
    >
      <FontAwesomeIcon icon={success ? faCheck : faTimes} />
    </div>
  );
};

const TheResistanceShowMissionVotingResults: React.FC<ResistanceProps> = ({
  game,
}) => {
  const dispatch = useDispatch();
  const [acknowledged, setAcknowledged] = useState(false);

  const onContinueClick = () => {
    dispatch(sendMessage(rstAckMissionVoteResults()));
    setAcknowledged(true);
  };

  const currentMission = game.allMissions[game.mission - 1];
  const missionSucceeded = currentMission.requiresTwoFails
    ? game.missionFailVotes.length < 2
    : game.missionFailVotes.length === 0;

  const allUsersWhoAcked = game.acknowledged;
  const playersWhoStillNeedToAck = game.players.filter(
    (player) => !allUsersWhoAcked.includes(player.userId)
  );

  const allResults = game.missionSuccessVotes
    .map((x) => ResistanceMissionVote.SUCCESS)
    .concat(game.missionFailVotes.map((x) => ResistanceMissionVote.FAIL));

  const resultSummaryStyle = {
    '--appear-delay': `${
      (allResults.length + 1) * ANIMATION_DELAY_MULTIPLIER_MS
    }ms`,
  } as CSSProperties;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>The results are in!</h1>
      <div className={styles.vote_results}>
        {allResults.map((vote, index) => (
          <VoteResultCard vote={vote} index={index} />
        ))}
      </div>
      <h2 className={styles.summary} style={resultSummaryStyle}>
        {missionSucceeded
          ? `Mission ${game.mission} has succeeded!`
          : `Mission ${game.mission} has failed!`}
      </h2>
      <section className={styles.bottom_area}>
        {!acknowledged && (
          <Button
            fullWidth
            className={styles.continue_button}
            onClick={onContinueClick}
            style={resultSummaryStyle}
          >
            Continue
          </Button>
        )}
        {!!acknowledged && (
          <WaitingMessage
            playersThatNeedToAct={playersWhoStillNeedToAck.map(prop('name'))}
            verb={'move on'}
          />
        )}
      </section>
    </div>
  );
};

export default TheResistanceShowMissionVotingResults;
