require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:tom) { create(:tom) }
  let(:comment) { build(:comment) }
  let(:tom_room) { create(:room, user: tom) }
  let(:tom_comment) { create(:comment, user: tom) }

  describe 'Association' do
    it { should belong_to(:user) }
    it { should belong_to(:room) }

    # dependent: :destroyのテスト
    it 'is dependent destroy user' do
      tom_comment
      expect {
        tom.destroy
      }.to change(Comment, :count).by(-1)
    end

    it 'is dependent destroy room' do
      create(:comment, room: tom_room)
      expect {
        tom_room.destroy
      }.to change(Comment, :count).by(-1)
    end
  end

  describe 'Validation' do
    context 'sentence' do
      it { should validate_presence_of(:sentence) }
      it { should validate_length_of(:sentence).is_at_most(1000) }
    end

    context 'user_id' do
      it { should validate_presence_of(:user_id) }

      it 'is invalid with non-numeric value' do
        comment.user_id = 'foo'
        comment.valid?
        expect(comment.errors[:user_id]).to include 'は数値で入力してください'
      end

      it 'is invalid with non-integer value' do
        comment.user_id = 1.2
        comment.valid?
        expect(comment.errors[:user_id]).to include 'は整数で入力してください'
      end
    end

    context 'room_id' do
      it { should validate_presence_of(:room_id) }

      it 'is invalid with non-numeric value' do
        comment.room_id = 'foo'
        comment.valid?
        expect(comment.errors[:room_id]).to include 'は数値で入力してください'
      end

      it 'is invalid with non-integer value' do
        comment.room_id = 1.2
        comment.valid?
        expect(comment.errors[:room_id]).to include 'は整数で入力してください'
      end
    end
  end

  describe 'Methods' do
    context '#data' do
      it 'returns data' do
        aggregate_failures do
          expect(tom_comment.data[:id]).to eq tom_comment.id
          expect(tom_comment.data[:sentence]).to eq tom_comment.sentence
          expect(tom_comment.data[:created_at]).to eq tom_comment.created_at
          expect(tom_comment.data[:user_id]).to eq tom_comment.user_id
        end
      end
    end
  end
end
