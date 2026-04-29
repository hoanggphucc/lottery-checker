import { PrizeEnum } from 'src/core/types';
import { ILotteryCheck } from './lottery.type';

type CheckLotteryReturn = {
  prize: string;
  number: string;
};

export function checkLottery(
  ticketNumber: string,
  data: ILotteryCheck,
): CheckLotteryReturn[] {
  const prizes = data.prizes;

  const prizeMap = {
    db: PrizeEnum.JACKPOT,
    g1: PrizeEnum.FIRST,
    g2: PrizeEnum.SECOND,
    g3: PrizeEnum.THIRD,
    g4: PrizeEnum.FOURTH,
    g5: PrizeEnum.FIFTH,
    g6: PrizeEnum.SIXTH,
    g7: PrizeEnum.SEVENTH,
    g8: PrizeEnum.EIGHTH,
  };

  const priority = {
    db: 0,
    g1: 1,
    g2: 2,
    g3: 3,
    g4: 4,
    g5: 5,
    g6: 6,
    g7: 7,
    g8: 8,
  };

  let matches: (CheckLotteryReturn & { priority: number })[] = [];

  for (let key in prizes) {
    const numbers = prizes[key];

    for (let num of numbers) {
      if (ticketNumber.endsWith(num)) {
        matches.push({
          prize: prizeMap[key],
          number: num,
          priority: priority[key],
        });
      }
    }
  }

  matches.sort((a, b) => a.priority - b.priority);

  return matches.map(({ priority, ...rest }) => rest);
}
