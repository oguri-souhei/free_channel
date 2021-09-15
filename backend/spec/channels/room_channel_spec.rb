require 'rails_helper'

RSpec.describe RoomChannel, type: :channel do
  let(:tom) { create(:tom) }
  let(:room) { create(:room) }
  let(:comment) { build(:comment, user: tom, room: room) }

  before do
    stub_connection headers: { 'X-USER-ID' => 1211 }
  end

  context 'with room_id' do
    before do
      subscribe id: room.id
    end

    it 'is confirmed' do
      expect(subscription).to be_confirmed
    end

    it 'streams from room_channel_[:room_id]' do
      expect(subscription).to have_stream_from "room_channel_#{room.id}"
    end

    it 'broadcasts the comment' do
      expect {
        perform :comment, comment: comment
      }.to have_broadcasted_to("room_channel_#{room.id}").with { |c|
        # ブロードキャストされたコメントは正しいか？
        aggregate_failures do
          expect(c['sentence']).to eq comment.sentence
          expect(c['user_id']).to eq comment.user_id
          expect(c['room_id']).to eq comment.room_id
        end
      }
    end

    it 'create a comment' do
      expect {
        perform :comment, comment: comment
      }.to change(Comment, :count).by(1)
    end
  end

  # 存在しないルーム
  context 'when room is not exist' do
    before do
      subscribe id: room.id + 1000
    end

    it 'is not confirmed' do
      expect(subscription).to_not be_confirmed
    end

    it 'rejects' do
      expect(subscription).to be_rejected
    end
  end

  context 'without room_id' do
    before do
      subscribe id: nil
    end

    it 'is not confirmed' do
      expect(subscription).to_not be_confirmed
    end

    it 'rejects' do
      expect(subscription).to be_rejected
    end
  end
end
