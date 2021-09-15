require 'rails_helper'

RSpec.describe Favorite, type: :model do
  let(:favorite) { build(:favorite) }
  let(:tom) { create(:tom) }
  let(:comment) { create(:comment) }
  let(:tom_favorite) { create(:favorite, user: tom, comment: comment) }

  describe 'Association' do
    it { should belong_to :user }
    it { should belong_to :comment }

    it 'is dependent destroy user' do
      tom_favorite
      expect {
        tom.destroy
      }.to change(Favorite, :count).by(-1)
    end

    it 'is dependent destroy comment' do
      tom_favorite
      expect {
        comment.destroy
      }.to change(Favorite, :count).by(-1)
    end
  end

  describe 'Validation' do
    context 'user_id' do
      it { should validate_presence_of(:user_id) }

      it 'is invalid with non-numeric value' do
        favorite.user_id = 'foo'
        favorite.valid?
        expect(favorite.errors[:user_id]).to include 'は数値で入力してください'
      end

      it 'is invalid with non-integer value' do
        favorite.user_id = 1.2
        favorite.valid?
        expect(favorite.errors[:user_id]).to include 'は整数で入力してください'
      end
    end

    context 'comment_id' do
      it { should validate_presence_of(:comment_id) }

      it 'is invalid when non-numeric value' do
        favorite.comment_id = 'foo'
        favorite.valid?
        expect(favorite.errors[:comment_id]).to include 'は数値で入力してください'
      end

      it 'is invalid with non-integer value' do
        favorite.comment_id = 1.2
        favorite.valid?
        expect(favorite.errors[:comment_id]).to include 'は整数で入力してください'
      end
    end
  end
end
