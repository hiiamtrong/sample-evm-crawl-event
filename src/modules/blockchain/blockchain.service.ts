import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { AppConfigService } from 'src/modules/configs/config.service';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  constructor(
    private readonly appConfig: AppConfigService,
  ) { }

  async getProvider() {
    const rpcUrl = this.appConfig.contract.readRpcUrl;
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  async getWriteProvider() {
    const writeRpcUrl = this.appConfig.contract.writeRpcUrl;
    return new ethers.JsonRpcProvider(writeRpcUrl);
  }

  async getAbi() {
    const abiPath = 'src/shared/abis/Dao4BuildPresale.json';
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    return abi;
  }

  async getTokenBalance(
    address: string,
    contractAddress: string,
    decimals: number,
  ) {
    const provider = await this.getProvider();

    const abi = await this.getAbi();

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const balance = await contract.balanceOf(address);
    const balanceInToken = ethers.formatUnits(balance, decimals);
    return balanceInToken;
  }

  async getNativeBalance(address: string) {
    const decimals = 18;
    const provider = await this.getProvider();

    const balance = await provider.getBalance(address);

    const balanceInEth = ethers.formatUnits(balance, decimals);
    return balanceInEth;
  }
}
