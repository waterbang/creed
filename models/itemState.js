import {
  db
} from '../utils/database.js'
import {
  UserModel
} from './user.js'
const userModel = new UserModel()
const openid = userModel.getOpenid();

class ItemState {
  constructor() {}

  /**
   * 更新like状态
   */
  upLike(_id,state) {
    return db.collection('item').doc(_id)
      .update({
        data: {
          isLike: state
        }
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err
      })
  }

}

module.exports = {
  ItemState
}