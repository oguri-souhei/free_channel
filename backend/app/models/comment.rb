class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :room
  has_many :favorites, dependent: :destroy

  enum opinion: { other_opinion: 0, opinion_1: 1, opinion_2: 2 }

  validates :sentence, presence: true, length: { maximum: 1000 }
  validates :opinion, presence: true
  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :room_id, presence: true, numericality: { only_integer: true }

  def data(user = nil)
    favorited = user.favorited?(self) if user
    {
      id:             self.id,
      sentence:       self.sentence,
      created_at:     self.created_at,
      avatar:         self.user.avatar,
      user_id:        self.user_id,
      user_name:      self.user.name,
      room_id:        self.room.id,
      favorited:      favorited,
      favorite_count: self.favorites.count
    }
  end
end
