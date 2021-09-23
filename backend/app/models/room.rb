class Room < ApplicationRecord
  include RoomsHelper

  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :name, presence: true, length: { maximum: 300 }
  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :category, presence: true, inclusion: { in: CATEGORIES }

  def self.search_by_name(term)
    Room.where('name LIKE ?', '%' + term + '%')
  end

  def self.search_by_category(term, page = 1)
    Room.where(category: term)
  end

  def data
    {
      id: id,
      name: name,
      created_at: created_at,
      comment_count: self.comments.count
    }
  end
end
