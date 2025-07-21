class Api::PlayersController < ApplicationController
    protect_from_forgery with: :null_session

    def index
        render json: Player.all
    end

    def show
        player = Player.find(params[:id])
        render json: player
    end

    def create
        player = Player.new(player_params)
        if player.save
            render json: player, status: :created
        else
            render json: { errors: player.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        player = Player.find(params[:id])
        if player.update(player_params)
            render json: player, status: :ok
        else
            render json: { errors: player.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def player_params
        params.require(:player).permit(:name, :rubies, :pickaxe, :fortune, :efficiency)
    end
end
