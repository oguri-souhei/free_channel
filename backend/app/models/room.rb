class Room < ApplicationRecord
  include RoomsHelper

  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :name, presence: true, length: { maximum: 300 }
  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :category, presence: true, inclusion: { in: CATEGORIES }

  # カテゴリーもしくは名前にマッチする検索結果を取得する
  def self.search(term = '')
    Room.where('category = ?', term).or(Room.where('name LIKE ?', "%#{term}%"))
  end

  def data
    {
      id: id,
      name: name,
      category: category,
      created_at: created_at,
      comment_count: self.comments.count,
    }
  end
end
