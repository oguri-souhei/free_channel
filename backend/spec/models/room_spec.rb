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
    context '#search_by_name' do
      before do
        create(:room, name: 'foo')
        create(:room, name: 'bar')
        create(:room, name: 'foobar')
      end

      it 'searches rooms' do
        rooms = Room.search_by_name('foo')
        aggregate_failures do
          expect(rooms.length).to eq 2
          expect(rooms[0].name).to eq 'foo'
          expect(rooms[1].name).to eq 'foobar'
        end
      end
    end

    context '#search_by_category' do
      it 'searches rooms' do
        create_list(:room, 11, category: 'プログラミング')
        rooms_1 = Room.search_by_category('プログラミング')
        aggregate_failures do
          expect(rooms_1[0].name).to eq Room.first.name
          expect(rooms_1[1].name).to eq Room.second.name
        end
        room_2 = Room.search_by_category('プログラミング', 2)
        aggregate_failures do
          expect(room_2[0].name).to eq Room.last.name
        end
      end
    end

    context '#data' do
      it 'returns room data' do
        comments = create_list(:comment, 7, room: tom_room)
        aggregate_failures do
          expect(tom_room.data[:id]).to eq tom_room.id
          expect(tom_room.data[:name]).to eq tom_room.name
          expect(tom_room.data[:created_at]).to eq tom_room.created_at
          expect(tom_room.data[:comment_count]).to eq tom_room.comments.count
          expect(tom_room.data[:avatar]).to eq tom_room.user.avatar
          expect(tom_room.data[:first_comment]).to eq comments.first.sentence
        end
      end
    end
  end
end
