require 'rails_helper'
include RoomsHelper

RSpec.describe Room, type: :model do
  let(:tom) { create(:tom) }
  let(:room) { build(:room) }
  let(:tom_room) { create(:room, user: tom) }

  describe 'Association' do
    it { should belong_to :user }
    it { should have_many :comments }

    it 'is dependent destroy user' do
      tom_room
      expect {
        tom.destroy
      }.to change(Room, :count).by(-1)
    end
  end

  describe 'Validation' do
    context 'name' do
      it { should validate_presence_of(:name).with_message('を入力してください') }
      it { should validate_length_of(:name).is_at_most(300).with_message('は300文字以内で入力してください') }
    end

    context 'category' do
      it { should validate_presence_of(:category).with_message('を選択してください') }
      it { should validate_inclusion_of(:category).in_array(CATEGORIES).with_message('は指定された中から選択してください') }
    end

    context 'user_id' do
      it { should validate_presence_of(:user_id).with_message('を入力してください') }

      it 'is invalid with non-numeric value' do
        room.user_id = 'foo'
        room.valid?
        expect(room.errors[:user_id]).to include 'は数値で入力してください'
      end

      it 'is invalid with non-integer value' do
        room.user_id = 1.2
        room.valid?
        expect(room.errors[:user_id]).to include 'は整数で入力してください'
      end
    end
  end

  describe 'Methods' do
    context '.search' do
      it 'returns result' do
        room_1 = create(:room, name: 'プログラミングするよ')
        room_2 = create(:room, category: 'プログラミング')
        room_3 = create(:room, category: 'その他')
        result = Room.search('プログラミング')
        aggregate_failures do
          expect(result).to include room_1
          expect(result).to include room_2
          expect(result).to_not include room_3
        end
      end
    end
    context '#data' do
      it 'returns room data' do
        comments = create_list(:comment, 7, room: tom_room)
        aggregate_failures do
          expect(tom_room.data[:id]).to eq tom_room.id
          expect(tom_room.data[:name]).to eq tom_room.name
          expect(tom_room.data[:category]).to eq tom_room.category
          expect(tom_room.data[:created_at]).to eq tom_room.created_at
          expect(tom_room.data[:comment_count]).to eq tom_room.comments.count
        end
      end
    end

    context '#sort_by_comments_size' do
      let(:most_commented_room) { create(:room) }
      let(:commented_room) { create(:room) }
      let(:least_commented_room) { create(:room) }

      before do
        create_list(:comment, 5, room: commented_room)
        create_list(:comment, 1, room: least_commented_room)
        create_list(:comment, 10, room: most_commented_room)
      end

      it 'sorts rooms by comments count' do
        rooms = Room.sort_by_comments_size
        aggregate_failures do
          expect(rooms[0]).to eq most_commented_room
          expect(rooms[1]).to eq commented_room
          expect(rooms[2]).to eq least_commented_room
        end
      end
    end
  end
end
