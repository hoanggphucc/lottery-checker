import { PrizeNameEnum } from 'src/prize/prize.type';
import { ILotteryCheck } from './lottery.type';

export function checkLottery(ticketNumber: string, data: ILotteryCheck) {
  const prizes = data.prizes;

  const prizeMap = {
    db: PrizeNameEnum.JACKPOT,
    g1: PrizeNameEnum.FIRST,
    g2: PrizeNameEnum.SECOND,
    g3: PrizeNameEnum.THIRD,
    g4: PrizeNameEnum.FOURTH,
    g5: PrizeNameEnum.FIFTH,
    g6: PrizeNameEnum.SIXTH,
    g7: PrizeNameEnum.SEVENTH,
    g8: PrizeNameEnum.EIGHTH,
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

  let matches: { prize: string; number: string; priority: number }[] = [];

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
