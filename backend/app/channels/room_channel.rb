class RoomChannel < ApplicationCable::Channel
  def subscribed
    room = Room.find_by(id: params[:id])
    reject and return if room.nil? # ルームが存在しない場合はリジェクト
    stream_from "room_channel_#{room.id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def comment(data)
    comment = Comment.create!({
      sentence: data['comment']['sentence'],
      user_id: data['comment']['user_id'],
      room_id: data['comment']['room_id']
    })
    # 作成したコメントをブロードキャスト
    ActionCable.server.broadcast("room_channel_#{comment.room_id}", comment.data)
  end
end
