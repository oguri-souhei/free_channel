require 'rails_helper'

RSpec.describe 'Api::V1::Rooms', type: :request do
  let(:tom) { create(:tom) }
  let(:other_user) { create(:user) }
  let(:room) { create(:room, user: tom) }
  let(:room_params) { attributes_for(:room) }
  let(:invalid_room_params) { attributes_for(:room, name: ' ', category: ' ') }
  let(:new_room_params) { attributes_for(:new_room) }

  describe 'GET /api/v1/rooms' do
    before do
      create_list(:room, 101)
      get api_v1_rooms_path
    end

    it 'responds :ok' do
      expect(response).to have_http_status :ok
    end

    it 'render json' do
      expect(response).to have_content_type :json
    end

    it 'returns rooms data' do
      data = JSON.parse(response.body)['data']
      aggregate_failures do
        expect(data['rooms'].length).to eq 50
        expect(data['rooms'][0]['id']).to eq Room.first.id
        expect(data['rooms'][1]['id']).to eq Room.second.id
        expect(data['rooms'][2]['id']).to eq Room.third.id
        expect(data['length']).to eq 3
      end
    end
  end

  describe 'GET /api/v1/rooms/:id' do
    context 'when the room is found' do
      it 'responds :ok' do
        get api_v1_room_path(room)
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        get api_v1_room_path(room)
        expect(response).to have_content_type :json
      end

      it 'render room data' do
        get api_v1_room_path(room)
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['room']['id']).to eq room.id
          expect(data['room']['name']).to eq room.name
          expect(data['room']['category']).to eq room.category
          expect(data['comments']).to eq room.comments
        end
      end
    end

    context 'when the room is not found' do
      it 'responds :not_found' do
        get api_v1_room_path(room.id + 1000)
        expect(response).to have_http_status :not_found
      end

      it 'render json' do
        get api_v1_room_path(room.id + 1000)
        expect(response).to have_content_type :json
      end

      it 'render message' do
        get api_v1_room_path(room.id + 10000)
        msg = JSON.parse(response.body)['message']
        expect(msg).to eq '404 not found'
      end
    end
  end

  describe 'POST /api/v1/rooms' do
    context 'when user is logged in' do
      before do
        login_as tom
      end

      context 'when params is valid' do
        it 'responds :ok' do
          post api_v1_rooms_path, params: { room: room_params }
          expect(response).to have_http_status :ok
        end

        it 'render json' do
          post api_v1_rooms_path, params: { room: room_params }
          expect(response).to have_content_type :json
        end

        it 'render room data' do
          post api_v1_rooms_path, params: { room: room_params }
          data = JSON.parse(response.body)['data']
          aggregate_failures do
            expect(data['name']).to eq room_params[:name]
            expect(data['category']).to eq room_params[:category]
            expect(data['user_id']).to eq tom.id
          end
        end

        it 'creates room' do
          expect {
            post api_v1_rooms_path, params: { room: room_params }
          }.to change(Room, :count).by(1)
        end
      end

      context 'when params is invalid' do
        it 'responds :bad_request' do
          post api_v1_rooms_path, params: { room: invalid_room_params }
          expect(response).to have_http_status :bad_request
        end

        it 'render json' do
          post api_v1_rooms_path, params: { room: invalid_room_params }
          expect(response).to have_content_type :json
        end

        it 'render errors' do
          post api_v1_rooms_path, params: { room: invalid_room_params }
          err = JSON.parse(response.body)['errors']
          aggregate_failures do
            expect(err[0]).to eq 'ルーム名を入力してください'
            expect(err[1]).to eq 'カテゴリーを選択してください'
            expect(err[2]).to eq 'カテゴリーは指定された中から選択してください'
          end
        end

        it 'does not create room' do
          expect {
            post api_v1_rooms_path, params: { room: invalid_room_params }
          }.to_not change(Room, :count)
        end
      end
    end

    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        post api_v1_rooms_path, params: { room: room_params }
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        post api_v1_rooms_path, params: { room: room_params }
        expect(response).to have_content_type :json
      end
    end
  end

  describe 'PATCH /rooms/:id' do
    context 'when user is logged in' do
      before do
        login_as tom
      end

      context 'when params is valid' do
        it 'responds :ok' do
          patch api_v1_room_path(room), params: { room: new_room_params }
          expect(response).to have_http_status :ok
        end

        it 'render json' do
          patch api_v1_room_path(room), params: { room: new_room_params }
          expect(response).to have_content_type :json
        end

        it 'render room data' do
          patch api_v1_room_path(room), params: { room: new_room_params }
          data = JSON.parse(response.body)['data']
          aggregate_failures do
            expect(data['name']).to eq new_room_params[:name]
            expect(data['category']).to eq new_room_params[:category]
          end
        end

        it 'updates room' do
          patch api_v1_room_path(room), params: { room: new_room_params }
          room.reload
          aggregate_failures do
            expect(room.name).to eq new_room_params[:name]
            expect(room.category).to eq new_room_params[:category]
          end
        end
      end

      context 'when params is invalid' do
        it 'responds :bad_request' do
          patch api_v1_room_path(room), params: { room: invalid_room_params }
          expect(response).to have_http_status :bad_request
        end

        it 'render json' do
          patch api_v1_room_path(room), params: { room: invalid_room_params }
          expect(response).to have_content_type :json
        end

        it 'render errors' do
          patch api_v1_room_path(room), params: { room: invalid_room_params }
          err = JSON.parse(response.body)['errors']
          aggregate_failures do
            expect(err[0]).to eq 'ルーム名を入力してください'
            expect(err[1]).to eq 'カテゴリーを選択してください'
            expect(err[2]).to eq 'カテゴリーは指定された中から選択してください'
          end
        end

        it 'does not update room' do
          patch api_v1_room_path(room), params: { room: invalid_room_params }
          room.reload
          aggregate_failures do
            expect(room.name).to_not eq invalid_room_params[:name]
            expect(room.category).to_not eq invalid_room_params[:category]
          end
        end
      end

      context 'when the room is not found' do
        it 'responds :not_found' do
          patch api_v1_room_path(room.id + 100), params: { room: new_room_params }
          expect(response).to have_http_status :not_found
        end

        it 'render json' do
          patch api_v1_room_path(room.id + 100), params: { room: new_room_params }
          expect(response).to have_content_type :json
        end
      end
    end

    context 'when other user updates the room' do
      before do
        login_as other_user
      end

      it 'responds :forbidden' do
        patch api_v1_room_path(room), params: { room: new_room_params }
        expect(response).to have_http_status :forbidden
      end

      it 'render json' do
        patch api_v1_room_path(room), params: { room: new_room_params }
        expect(response).to have_content_type :json
      end

      it 'does not update room' do
        patch api_v1_room_path(room), params: { room: new_room_params }
        room.reload
        aggregate_failures do
          expect(room.name).to_not eq new_room_params[:name]
          expect(room.category).to_not eq new_room_params[:category]
        end
      end
    end

    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        patch api_v1_room_path(room), params: { room: new_room_params }
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        patch api_v1_room_path(room), params: { room: new_room_params }
        expect(response).to have_content_type :json
      end

      it 'does not update room' do
        patch api_v1_room_path(room), params: { room: new_room_params }
        room.reload
        aggregate_failures do
          expect(room.name).to_not eq new_room_params[:name]
          expect(room.category).to_not eq new_room_params[:category]
        end
      end
    end
  end

  describe 'DELETE /rooms/:id' do
    context 'when user is logged in' do
      before do
        login_as tom
      end

      it 'responds :ok' do
        delete api_v1_room_path(room)
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        delete api_v1_room_path(room)
        expect(response).to have_content_type :json
      end

      it 'destroys room' do
        room
        expect {
          delete api_v1_room_path(room)
        }.to change(Room, :count).by(-1)
      end
    end

    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        delete api_v1_room_path(room)
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        delete api_v1_room_path(room)
        expect(response).to have_content_type :json
      end

      it 'does not destroy room' do
        room
        expect {
          delete api_v1_room_path(room)
        }.to_not change(Room, :count)
      end
    end

    context 'when rooms is not found' do
      before do
        login_as tom
      end

      it 'responds :not_found' do
        delete api_v1_room_path(room.id + 100)
        expect(response).to have_http_status :not_found
      end

      it 'render json' do
        delete api_v1_room_path(room.id + 100)
        expect(response).to have_content_type :json
      end

      it 'does not destroy room' do
        room
        expect {
          delete api_v1_room_path(room.id + 100)
        }.to_not change(Room, :count)
      end
    end
  end
end
