import { COLOR } from '../command/colors';
import { logDebug } from '../logDebug';

describe('logDebug', () => {
  it('should log a message with the color yellow', () => {
    const spy = jest.spyOn(console, 'log');
    logDebug('test message');
    expect(spy).toHaveBeenCalledWith(COLOR.YELLOW, 'DEBUG: ', 'test message');
  });
});